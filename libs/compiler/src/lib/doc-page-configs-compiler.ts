import chalk from 'chalk';
import chokidar from 'chokidar';
import { format } from 'date-fns';
import fs from 'fs/promises';
import glob from 'glob';
import path from 'path';
import prettier from 'prettier';
import { concat, EMPTY, iif, Observable, tap } from 'rxjs';

import { concatMap, debounceTime, filter, map, scan } from 'rxjs/operators';

import ts from 'typescript';

const docPageConfigFilesGlob = '**/*.doc-page.ts';

interface EventPayload {
  filePath: string;
  configString: string;
}

interface RawInitEvent {
  type: 'init';
  filePaths: string[];
}

interface ProcessedInitEvent {
  type: 'init';
  filePaths: string[];
  payload: EventPayload[];
}

interface RawAddEvent {
  type: 'add';
  filePath: string;
}

interface ProcessedAddEvent {
  type: 'add';
  filePath: string;
  configString: string;
}

interface RawChangeEvent {
  type: 'change';
  filePath: string;
}

interface ProcessedChangeEvent {
  type: 'change';
  filePath: string;
  configString: string;
}

interface UnlinkEvent {
  type: 'unlink';
  filePath: string;
}

type RawFileEvent = RawInitEvent | RawAddEvent | RawChangeEvent | UnlinkEvent;
type ProcessedFileEvent =
  | ProcessedInitEvent
  | ProcessedAddEvent
  | ProcessedChangeEvent
  | UnlinkEvent;

export class DocPageConfigsCompiler {
  constructor(
    private readonly shouldWatch: boolean,
    private readonly silenced: boolean
  ) {}

  compile() {
    const initialFileEvent = new Observable<RawInitEvent>((observer) => {
      this.log(chalk.blue('Searching for component document page files...\n'));
      const startTime = Date.now();
      glob(
        docPageConfigFilesGlob,
        { ignore: 'node_modules' },
        (err, filePaths) => {
          if (err) {
            observer.error(err);
          } else {
            const endTime = Date.now();
            this.log(
              chalk.green(`Searching complete in ${endTime - startTime}ms`)
            );
            observer.next({ type: 'init', filePaths });
          }
          observer.complete();
        }
      );
    });

    const watcher = new Observable<RawFileEvent>((observer) => {
      const watch = chokidar
        .watch(docPageConfigFilesGlob, {
          ignored: 'node_modules',
          ignoreInitial: true,
        })
        .on('all', async (event, rawFilePath) => {
          const filePath = rawFilePath.replace(/\\/g, '/');
          if (event === 'add' || event === 'addDir') {
            this.log(chalk.green(`${timeNow()} - ADDED - ${filePath}`));
            observer.next({ type: 'add', filePath });
          } else if (event === 'unlink' || event === 'unlinkDir') {
            this.log(chalk.red(`${timeNow()} - DELETED - ${filePath}`));
            observer.next({ type: 'unlink', filePath });
          } else {
            this.log(chalk.yellow(`${timeNow()} - CHANGED - ${filePath}`));
            observer.next({ type: 'change', filePath });
          }
        });

      return () => {
        watch.unwatch(docPageConfigFilesGlob);
        watch.close();
      };
    });

    concat(
      initialFileEvent,
      iif(() => this.shouldWatch, watcher, EMPTY)
    )
      .pipe(
        concatMap(this.addPayloadToEvent.bind(this)),
        filter((fileEvent): fileEvent is ProcessedFileEvent => !!fileEvent),
        scan(exportedForTesting.accumulatePayloads, new Array<EventPayload>()),
        debounceTime(500),
        map((fileEvents) =>
          fileEvents.map((fileEvent) => fileEvent.configString)
        ),
        tap((configStrings) =>
          this.writeDynamicPageConfigStringsToFile(configStrings)
        )
      )
      .subscribe();
  }

  private async addPayloadToEvent(
    fileEvent: RawFileEvent
  ): Promise<ProcessedFileEvent | null> {
    try {
      if (fileEvent.type === 'init') {
        const payload: EventPayload[] = [];
        this.log(chalk.blue('Compiling component document page files...\n'));
        const startTime = Number(new Date());
        for (const filePath of fileEvent.filePaths) {
          const configString =
            await exportedForTesting.compileDynamicDocPageConfigString(
              filePath
            );
          payload.push({ filePath, configString });
        }
        const endTime = Number(new Date());
        this.log(
          chalk.green(
            `Finished compiling component document page files in ${
              endTime - startTime
            }ms`
          )
        );
        return { ...fileEvent, payload };
      } else if (fileEvent.type === 'add' || fileEvent.type === 'change') {
        const startTime = Date.now();
        const configString =
          await exportedForTesting.compileDynamicDocPageConfigString(
            fileEvent.filePath
          );
        const endTime = Date.now();
        this.log(
          chalk.blue(
            `${timeNow()} - COMPILE - recompiled in ${endTime - startTime}ms`
          )
        );
        return { ...fileEvent, configString };
      } else {
        return fileEvent;
      }
    } catch (error) {
      this.log(
        chalk.red(`Unexpected error occurred while compiling...\n${error}`)
      );
      return null;
    }
  }

  private async writeDynamicPageConfigStringsToFile(configStrings: string[]) {
    try {
      await fs.writeFile(
        './apps/component-document-portal/src/app/doc-page-configs.ts',
        prettier.format(
          `
        import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

        export const docPageConfigs = {
          ${configStrings.toString()}
        } as Record<string, DynamicDocPageConfig>;
      `,
          { parser: 'typescript', printWidth: 100, singleQuote: true }
        )
      );
    } catch (e) {
      console.error(e);
      this.log(
        chalk.red(
          `\n\nUnexpected error occurred while generating doc-page-configs.ts\n`
        )
      );
    }
  }

  private log(message: string) {
    if (!this.silenced) {
      console.log(message);
    }
  }
}

/**
 * Extract all the payloads from the various processed file events.
 *
 * @param acc The previous accumulated payloads
 * @param curr The current file event
 */
function accumulatePayloads(
  acc: EventPayload[],
  curr: ProcessedFileEvent
): EventPayload[] {
  if (curr.type === 'init') {
    return curr.payload;
  } else if (curr.type === 'add') {
    return [
      ...acc,
      { filePath: curr.filePath, configString: curr.configString },
    ];
  } else if (curr.type === 'unlink') {
    return acc.filter((f) => f.filePath !== curr.filePath);
  } else if (curr.type === 'change') {
    const index = acc.findIndex((f) => f.filePath === curr.filePath);
    if (index < 0) {
      return acc;
    }
    const copy = [...acc];
    copy[index] = {
      filePath: curr.filePath,
      configString: curr.configString,
    };
    return copy;
  }
  // Can't happen, but needed for the compiler
  return [];
}

/**
 * Build the config string for a particular input file.
 *
 * @param filePath The location of the file. Both the filename and the
 * contents of the file will be used for generate the doc page config
 */
async function compileDynamicDocPageConfigString(filePath: string) {
  const rawTS = (await fs.readFile('./' + filePath)).toString();

  // create a TS node source for our traversal
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    rawTS,
    ts.ScriptTarget.Latest
  );
  const title = exportedForTesting.findTitle(sourceFile, filePath);
  return exportedForTesting.generateDocPageConfig(filePath, title);
}

/**
 * Generate the doc page config from the filePath and the title.
 *
 * @param filePath The original filePath (with '.ts')
 * @param title The title for the file
 */
function generateDocPageConfig(filePath: string, title: string) {
  // Figure out variables for config list file output
  const filePathWithoutExtension = filePath.replace('.ts', '');
  const route = title.toLowerCase().replace(/[ /]/g, '-');
  return `
      '${route}': {
        title: '${title}',
        loadConfig: () => import('../../../../${filePathWithoutExtension}').then((file) => file.default)
      }
    `;
}

/**
 * Find the title from the sourceFile, if possible. Throw an error if
 * it can't be found.
 *
 * @param sourceFile The sourceFile
 * @param filePath The file being examined (used for error logging)
 */
function findTitle(sourceFile: ts.SourceFile, filePath: string) {
  // Find the starting point for the recursive traversal
  // This is hopefully an object that is being default exported or has the `DocPageConfig` type
  const statementWithTitle = exportedForTesting.findStatementWithTitle(
    sourceFile.statements,
    sourceFile
  );

  if (!statementWithTitle) {
    throw new Error(`Could not find doc page config export from ${filePath}`);
  }

  // Recursively traverse the nodes from the starting point looking for a string literal
  const rawTitle = exportedForTesting.recursivelyFindTitle(
    statementWithTitle,
    sourceFile
  );

  if (!rawTitle) {
    throw new Error(
      `Could not find title in page config for ${filePath}...\n` +
        `Make sure to only provide a single or double quote string literal.`
    );
  }

  // Get rid of the surrounding string literal marks (single or double quotes)
  return rawTitle.replace(/['"]/g, '');
}

/**
 * Find the statement that includes the exported title, if possible.
 *
 * @param statements The TS statements for the sourceFile. This is passed
 * separate from the sourceFile itself to simplify unit testing.
 * @param sourceFile The sourceFile
 */
function findStatementWithTitle(
  statements: ReadonlyArray<ts.Statement>,
  sourceFile: ts.SourceFile
) {
  return statements.find((statement) => {
    const text = statement.getText(sourceFile);

    return (
      ((text.includes('DocPageConfig') && !text.includes('import')) ||
        text.includes('export default')) &&
      text.includes('title:')
    );
  });
}

/**
 * Return the value of the first StringLiteral found in a depth-first traversal of the tree.
 *
 * @param node The node to examine
 * @param sourceFile The file upon which the node is built
 */
function recursivelyFindTitle(
  node: ts.Node,
  sourceFile: ts.SourceFile
): string | null {
  const children = node.getChildren(sourceFile);
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const result = exportedForTesting.recursivelyFindTitle(
        children[i],
        sourceFile
      );
      if (result !== null) {
        return result;
      }
    }
  } else {
    if (node.kind === ts.SyntaxKind.StringLiteral) {
      return node.getText(sourceFile);
    } else {
      return null;
    }
  }
  return null;
}

function timeNow() {
  return format(new Date(), 'HH:mm:ss:SSS');
}

export const exportedForTesting = {
  accumulatePayloads,
  compileDynamicDocPageConfigString,
  findStatementWithTitle,
  findTitle,
  generateDocPageConfig,
  recursivelyFindTitle,
};
