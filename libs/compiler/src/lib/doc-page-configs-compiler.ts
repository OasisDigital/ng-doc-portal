import chalk from 'chalk';
import chokidar from 'chokidar';
import glob from 'glob-promise';
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
  switchMap,
  forkJoin,
  merge,
} from 'rxjs';

import { CompilerMode } from '@cdp/component-document-portal/util-types';

import { CONFIG_FILE_LOCATION } from './constants';
import {
  ProcessedFileEvent,
  EventPayload,
  RawInitEvent,
  RawFileEvent,
  CdpConfig,
  GlobPattern,
} from './types';
import {
  accumulateFilePaths,
  accumulatePayloads,
  createRuntimeConfig,
  extractTitleFromDocPageFile,
  formatContent,
  generateDocPageConfig,
  timeNow,
  wrapTypescriptBoilerplate,
} from './util';

import { existsSync } from 'fs';
import fs from 'fs/promises';

export class DocPageConfigsCompiler {
  private readonly content: Observable<string>;

  constructor(
    readonly mode: CompilerMode,
    readonly shouldWatch: boolean,
    private readonly configFileLocation: string,
    private readonly silenced: boolean
  ) {
    if (!existsSync(this.configFileLocation)) {
      throw new Error(
        `Could not find config file at ${this.configFileLocation}`
      );
    }
    const configLoad: Observable<CdpConfig> = from(
      fs.readFile(this.configFileLocation)
    ).pipe(map((file) => JSON.parse(file.toString())));

    const globPatterns = configLoad.pipe(
      map((config) => {
        let patterns: (string | GlobPattern)[] | undefined =
          config.globPatterns;
        if (!patterns && config.globPattern) {
          patterns = [config.globPattern];
        }

        if (!patterns) {
          throw new Error('No glob patterns detected in configuration file');
        }

        return patterns;
      })
    );

    const fileEvents = defer(() => globPatterns).pipe(
      switchMap((patterns) =>
        concat(
          this.buildInitialFileEvent(patterns),
          iif(() => shouldWatch, this.buildWatcher(patterns), EMPTY)
        )
      )
    );

    if (mode === 'lazy') {
      this.content = fileEvents.pipe(
        concatMap(this.addPayloadToEvent.bind(this)),
        filter((fileEvent): fileEvent is ProcessedFileEvent => !!fileEvent),
        scan(accumulatePayloads, new Array<EventPayload>()),
        debounceTime(500),
        map(this.detectAndHandleDuplicateTitles.bind(this)),
        map((eventPayloads) =>
          eventPayloads.map((eventPayload) =>
            generateDocPageConfig(eventPayload.filePath, eventPayload.title)
          )
        ),
        map(wrapTypescriptBoilerplate),
        map(formatContent)
      );
    } else {
      this.content = fileEvents.pipe(
        scan(accumulateFilePaths, new Array<string>()),
        debounceTime(500),
        map(createRuntimeConfig),
        map(formatContent)
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
  private buildInitialFileEvent(
    patterns: (string | GlobPattern)[]
  ): Observable<RawInitEvent> {
    this.log(chalk.blue('Searching for component document page files...\n'));
    const startTime = Date.now();

    return forkJoin(
      patterns.map((val) => {
        const pattern = typeof val === 'string' ? val : val.pattern;
        return from(glob.promise(pattern, { ignore: 'node_modules' }));
      })
    ).pipe(
      map((filePathsArr) => filePathsArr.flat()),
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
  private buildWatcher(
    patterns: (string | GlobPattern)[]
  ): Observable<RawFileEvent> {
    return merge(
      ...patterns.map(
        (globPattern) =>
          new Observable<RawFileEvent>((observer) => {
            const pattern =
              typeof globPattern === 'string'
                ? globPattern
                : globPattern.pattern;

            const watch = chokidar
              .watch(pattern, {
                ignored: 'node_modules',
                ignoreInitial: true,
              })
              .on('all', async (event, rawFilePath) => {
                observer.next(this.buildRawFileEvent(rawFilePath, event));
              });

            return () => {
              watch.unwatch(pattern);
              watch.close();
            };
          })
      )
    );
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
          const title = await extractTitleFromDocPageFile(filePath);
          payload.push({ filePath, title });
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
        const title = await extractTitleFromDocPageFile(fileEvent.filePath);
        const endTime = Date.now();
        this.log(
          chalk.blue(
            `${timeNow()} - COMPILE - recompiled in ${endTime - startTime}ms`
          )
        );
        return { ...fileEvent, title };
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

  private detectAndHandleDuplicateTitles(eventPayloads: EventPayload[]) {
    let duplicatesDetected = false;
    const titles: Record<string, number> = {};
    for (const payload of eventPayloads) {
      if (titles[payload.title] !== undefined) {
        duplicatesDetected = true;
        this.log(
          chalk.yellow(
            `Duplicated title of "${payload.title}" detected in file '${payload.filePath}'`
          )
        );
        payload.title += ` ${++titles[payload.title]}`;
      }
      titles[payload.title] = 1;
    }
    if (duplicatesDetected) {
      this.log(
        chalk.yellow('\nPlease resolve duplicated titles before publishing!\n')
      );
    }
    return eventPayloads;
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
