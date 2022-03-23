import chalk from 'chalk';
import chokidar from 'chokidar';
import fs from 'fs/promises';
import glob from 'glob';
import path from 'path';
import prettier from 'prettier';
import { concat, EMPTY, iif, Observable, tap } from 'rxjs';

import { concatMap, debounceTime, filter, map, scan } from 'rxjs/operators';

import ts from 'typescript';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const yargOptions = yargs(hideBin(process.argv)).argv;

const docPageConfigFilesGlob = '**/*.doc-page.ts';

const shouldWatch = Boolean(process.env.watch ?? yargOptions.watch ?? false);
const silenced = Boolean(process.env.silent ?? yargOptions.silent ?? false);

interface EventPayload {
  filePath: string;
  configString: string;
}

interface InitEvent {
  type: 'init';
  filePaths: string[];
  payload?: EventPayload[];
}

interface AddEvent {
  type: 'add';
  filePath: string;
  configString?: string;
}

interface ChangeEvent {
  type: 'change';
  filePath: string;
  configString?: string;
}

interface UnlinkEvent {
  type: 'unlink';
  filePath: string;
}

type FileEvent = InitEvent | AddEvent | ChangeEvent | UnlinkEvent;

const initialFileEvent = new Observable<FileEvent>((observer) => {
  log(chalk.blue('Searching for component document page files...\n'));
  const startTime = Date.now();
  glob(docPageConfigFilesGlob, { ignore: 'node_modules' }, (err, filePaths) => {
    if (err) {
      observer.error(err);
    } else {
      const endTime = Date.now();
      log(chalk.green(`Searching complete in ${endTime - startTime}ms`));
      observer.next({ type: 'init', filePaths });
    }
    observer.complete();
  });
});

const watcher = new Observable<FileEvent>((observer) => {
  const watch = chokidar
    .watch(docPageConfigFilesGlob, {
      ignored: 'node_modules',
      ignoreInitial: true,
    })
    .on('all', async (event, rawFilePath) => {
      const filePath = rawFilePath.replaceAll('\\', '/');
      if (event === 'add' || event === 'addDir') {
        log(chalk.green(`${timeNow()} - ADDED - ${filePath}`));
        observer.next({ type: 'add', filePath });
      } else if (event === 'unlink' || event === 'unlinkDir') {
        log(chalk.red(`${timeNow()} - DELETED - ${filePath}`));
        observer.next({ type: 'unlink', filePath });
      } else {
        log(chalk.yellow(`${timeNow()} - CHANGED - ${filePath}`));
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
  iif(() => shouldWatch, watcher, EMPTY)
)
  .pipe(
    concatMap(addPayloadToEvent),
    filter((fileEvent): fileEvent is FileEvent => !!fileEvent),
    scan(accumulatePayloads, new Array<EventPayload>()),
    debounceTime(500),
    map((fileEvents) => fileEvents.map((fileEvent) => fileEvent.configString)),
    tap((configStrings) => writeDynamicPageConfigStringsToFile(configStrings))
  )
  .subscribe();

function accumulatePayloads(
  acc: EventPayload[],
  curr: FileEvent
): EventPayload[] {
  if (curr.type === 'init') {
    return curr.payload ?? [];
  } else if (curr.type === 'add') {
    return [
      ...acc,
      { filePath: curr.filePath, configString: curr.configString ?? '' },
    ];
  } else if (curr.type === 'unlink') {
    return acc.filter((f) => f.filePath !== curr.filePath);
  } else if (curr.type === 'change') {
    const index = acc.findIndex((f) => f.filePath === curr.filePath);
    const copy = [...acc];
    copy[index] = {
      filePath: curr.filePath,
      configString: curr.configString ?? '',
    };
    return copy;
  }
  return [];
}

async function addPayloadToEvent(
  fileEvent: FileEvent
): Promise<FileEvent | null> {
  try {
    if (fileEvent.type === 'init') {
      const payload: EventPayload[] = [];
      log(chalk.blue('Compiling component document page files...\n'));
      const startTime = Number(new Date());
      for (const filePath of fileEvent.filePaths) {
        const configString = await compileDynamicDocPageConfigString(filePath);
        payload.push({ filePath, configString });
      }
      const endTime = Number(new Date());
      log(
        chalk.green(
          `Finished compiling component document page files in ${
            endTime - startTime
          }ms`
        )
      );
      return { ...fileEvent, payload };
    } else if (fileEvent.type === 'add' || fileEvent.type === 'change') {
      const startTime = Date.now();
      const configString = await compileDynamicDocPageConfigString(
        fileEvent.filePath
      );
      const endTime = Date.now();
      log(
        chalk.blue(
          `${timeNow()} - COMPILE - recompiled in ${endTime - startTime}ms`
        )
      );
      return { ...fileEvent, configString };
    } else {
      return fileEvent;
    }
  } catch (error) {
    log(chalk.red(`Unexpected error occurred while compiling...\n${error}`));
    return null;
  }
}

async function writeDynamicPageConfigStringsToFile(configStrings: string[]) {
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
    log(
      chalk.red(
        `\n\nUnexpected error occurred while generating doc-page-configs.ts\n`
      )
    );
  }
}

async function compileDynamicDocPageConfigString(filePath = '') {
  const rawTS = (await fs.readFile('./' + filePath)).toString();

  // create a TS node source for our traversal
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    rawTS,
    ts.ScriptTarget.Latest
  );

  // Find the starting point for the recursive traversal
  // This is hopefully an object that is being default exported or has the `DocPageConfig` type
  const statementWithTitle = sourceFile.statements.find((statement) => {
    const text = statement.getText(sourceFile);

    return (
      ((text.includes('DocPageConfig') && !text.includes('import')) ||
        text.includes('export default')) &&
      text.includes('title:')
    );
  });

  if (!statementWithTitle) {
    throw new Error(`Could not find doc page config export from ${filePath}`);
  }

  // Recursively look traverse the nodes from the starting point looking for a string literal
  const rawTitle = recursivelyFindTitle(statementWithTitle, sourceFile);

  if (!rawTitle) {
    throw new Error(
      `Could not find title in page config for ${filePath}...\nMake sure to only provide a single or double quote string literal.`
    );
  }

  //Getting rid of the surrounding string literal marks (single or double quotes)
  const title = rawTitle.replace(/['"]/g, '');

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

function recursivelyFindTitle(
  node: ts.Node,
  sourceFile: ts.SourceFile
): string | null {
  const children = node.getChildren(sourceFile);
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const result = recursivelyFindTitle(children[i], sourceFile);
      if (result !== null) {
        return result;
      }
    }
  } else {
    const syntaxKind = ts.SyntaxKind[node.kind];
    if (syntaxKind === 'StringLiteral') {
      return node.getText(sourceFile);
    } else {
      return null;
    }
  }
  return null;
}

function timeNow() {
  const d = new Date();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const milliseconds = d.getMilliseconds();
  const h = (hours < 10 ? '0' : '') + hours;
  const m = (minutes < 10 ? '0' : '') + minutes;
  const s = (seconds < 10 ? '0' : '') + seconds;
  const ms =
    (milliseconds < 10 ? '00' : '') +
    (10 < milliseconds && milliseconds < 100 ? '0' : '') +
    milliseconds;
  return `${h}:${m}:${s}:${ms}`;
}

function log(message: string) {
  if (!silenced) {
    console.log(message);
  }
}
