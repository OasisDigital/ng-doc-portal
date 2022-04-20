import chalk from 'chalk';
import chokidar from 'chokidar';
import { format } from 'date-fns';
import fs from 'fs/promises';
import glob from 'glob-promise';
import path from 'path';
import prettier from 'prettier';
import {
  concat,
  concatMap,
  debounceTime,
  defer,
  EMPTY,
  filter,
  from,
  iif,
  map,
  Observable,
  scan,
  tap,
} from 'rxjs';

import ts from 'typescript';

import { CompilerMode } from '@cdp/component-document-portal/util-types';

export const DOC_PAGE_CONFIG_FILES_GLOB = '**/*.doc-page.ts';
export const CONFIG_FILE_LOCATION =
  './apps/component-document-portal/src/app/doc-page-configs.ts';

interface EventPayload {
  filePath: string;
  configString: string;
}

export interface RawInitEvent {
  type: 'init';
  filePaths: string[];
}

interface ProcessedInitEvent extends RawInitEvent {
  payload: EventPayload[];
}

export interface RawAddEvent {
  type: 'add';
  filePath: string;
}

interface ProcessedAddEvent extends RawAddEvent {
  configString: string;
}

export interface RawChangeEvent {
  type: 'change';
  filePath: string;
}

interface ProcessedChangeEvent extends RawChangeEvent {
  configString: string;
}

export interface UnlinkEvent {
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
  private readonly content: Observable<string>;

  constructor(
    readonly mode: CompilerMode,
    readonly shouldWatch: boolean,
    private readonly silenced: boolean
  ) {
    const fileEvents = defer(() =>
      concat(
        this.buildInitialFileEvent(),
        iif(() => shouldWatch, this.buildWatcher(), EMPTY)
      )
    );
    if (mode === 'lazy') {
      this.content = fileEvents.pipe(
        concatMap(this.addPayloadToEvent.bind(this)),
        filter((fileEvent): fileEvent is ProcessedFileEvent => !!fileEvent),
        scan(exportedForTesting.accumulatePayloads, new Array<EventPayload>()),
        debounceTime(500),
        map((eventPayloads) =>
          eventPayloads.map((eventPayload) => eventPayload.configString)
        ),
        map(wrapTypescriptBoilerplate),
        map(exportedForTesting.formatContent)
      );
    } else {
      this.content = fileEvents.pipe(
        scan(exportedForTesting.accumulateFilePaths, new Array<string>()),
        debounceTime(500),
        map(createdRuntimeConfig),
        map(exportedForTesting.formatContent)
      );
    }
  }

  /**
   * Compile the existing a modified files and save them to a file.
   */
  compile() {
    this.content.subscribe(
      async (content) => await this.writeDynamicPageContentToFile(content)
    );
  }

  /**
   * Build an Observable that emits the initial list of file paths.
   * @private
   */
  private buildInitialFileEvent(): Observable<RawInitEvent> {
    this.log(chalk.blue('Searching for component document page files...\n'));
    const startTime = Date.now();
    return from(
      glob.promise(DOC_PAGE_CONFIG_FILES_GLOB, { ignore: 'node_modules' })
    ).pipe(
      map((filePaths): RawInitEvent => ({ type: 'init', filePaths })),
      tap(() => {
        const endTime = Date.now();
        this.log(chalk.green(`Searching complete in ${endTime - startTime}ms`));
      })
    );
  }

  /**
   * Generate an Observable of the raw file events.
   * @private
   */
  private buildWatcher(): Observable<RawFileEvent> {
    return new Observable<RawFileEvent>((observer) => {
      const watch = chokidar
        .watch(DOC_PAGE_CONFIG_FILES_GLOB, {
          ignored: 'node_modules',
          ignoreInitial: true,
        })
        .on('all', async (event, rawFilePath) => {
          observer.next(this.buildRawFileEvent(rawFilePath, event));
        });

      return () => {
        watch.unwatch(DOC_PAGE_CONFIG_FILES_GLOB);
        watch.close();
      };
    });
  }

  /**
   * Create the RawFileEvent from the chokidar event.
   *
   * @param rawFilePath The file that was modified
   * @param event The type of chokidar change
   * @private
   */
  private buildRawFileEvent(
    rawFilePath: string,
    event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir'
  ): RawFileEvent {
    const filePath = rawFilePath.replace(/\\/g, '/');
    if (event === 'add' || event === 'addDir') {
      this.log(chalk.green(`${timeNow()} - ADDED - ${filePath}`));
      return { type: 'add', filePath };
    } else if (event === 'unlink' || event === 'unlinkDir') {
      this.log(chalk.red(`${timeNow()} - DELETED - ${filePath}`));
      return { type: 'unlink', filePath };
    } else {
      this.log(chalk.yellow(`${timeNow()} - CHANGED - ${filePath}`));
      return { type: 'change', filePath };
    }
  }

  /**
   * Process a raw file event, adding config string payloads.
   *
   * @param fileEvent The raw file event that describe which file(s)
   * is affected and what is happening.
   * @private
   */
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

  /**
   * Generate a file to hold the config content.
   *
   * @param content The config content generated from our path files
   * @private
   */
  private async writeDynamicPageContentToFile(content: string) {
    try {
      await fs.writeFile(CONFIG_FILE_LOCATION, content);
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

function createdRuntimeConfig(filePaths: string[]) {
  let fullString = `
  import { RuntimeDocConfigArray, CompilerMode } from '@cdp/component-document-portal/util-types';
  export const docPageConfigs = [`;
  for (const filePath of filePaths) {
    const splitPath = filePath.split('.ts');
    fullString =
      fullString +
      `() => import('../../../../${splitPath[0]}').then(
      (file) => file.default
    ),`;
  }
  fullString = fullString + `] as RuntimeDocConfigArray;`;
  fullString =
    fullString + `export const applicationMode:CompilerMode = 'runtime';`;
  return fullString;
}

/**
 * Extract all the filePaths from the various processed file events.
 *
 * @param acc The previous accumulated filePaths
 * @param curr The current file event
 */
function accumulateFilePaths(acc: string[], curr: RawFileEvent): string[] {
  if (curr.type === 'init') {
    return curr.filePaths;
  } else if (curr.type === 'add') {
    return [...acc, curr.filePath];
  } else if (curr.type === 'unlink') {
    return acc.filter((f) => f !== curr.filePath);
  } else if (curr.type === 'change') {
    return acc;
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

/**
 * Generate the text of formatted TypeScript file around the config strings.
 *
 * @param configStrings The config strings generated from our path files
 * @private
 */
function formatContent(content: string): string {
  return prettier.format(content, {
    parser: 'typescript',
    printWidth: 100,
    singleQuote: true,
  });
}

function wrapTypescriptBoilerplate(configStrings: string[]) {
  return `
  import { LazyDocConfigRecord, CompilerMode } from '@cdp/component-document-portal/util-types';

  export const docPageConfigs = {
    ${configStrings.toString()}
  } as LazyDocConfigRecord;
  export const applicationMode:CompilerMode = 'lazy';
`;
}

function timeNow() {
  return format(new Date(), 'HH:mm:ss:SSS');
}

export const exportedForTesting = {
  accumulateFilePaths,
  accumulatePayloads,
  compileDynamicDocPageConfigString,
  findStatementWithTitle,
  findTitle,
  formatContent,
  generateDocPageConfig,
  recursivelyFindTitle,
};
