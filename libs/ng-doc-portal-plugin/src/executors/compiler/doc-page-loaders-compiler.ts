import { readJsonFile } from '@nx/devkit';
import { green, blue, red, yellow } from 'chalk';
import { watch } from 'chokidar';
import { glob } from 'fast-glob';
import {
  concatMap,
  debounceTime,
  filter,
  from,
  map,
  Observable,
  scan,
  tap,
  switchMap,
  firstValueFrom,
  concat,
  take,
  shareReplay,
} from 'rxjs';

import {
  ProcessedFileEvent,
  EventPayload,
  RawInitEvent,
  RawFileEvent,
  NgDocPortalConfig,
  GlobPattern,
} from './types';
import {
  convertPatternOrGlobPatternArray,
  accumulatePayloads,
  extractTitleFromDocPageFile,
  formatContent,
  generateDocPageLoader,
  timeNow,
  wrapTypescriptBoilerplate,
} from './util';

import { existsSync, writeFileSync } from 'fs';

export class DocPageLoadersCompiler {
  private globPatterns: (string | GlobPattern)[];

  constructor(
    private readonly configFileLocation: string,
    private readonly docPageLoadersFileLocation: string,
    private readonly silenced = false,
  ) {
    if (!existsSync(this.configFileLocation)) {
      throw new Error(
        `Could not find config file at ${this.configFileLocation}`,
      );
    }

    const config: NgDocPortalConfig = readJsonFile(this.configFileLocation);

    let patterns = config.globPatterns;
    if (!patterns && config.globPattern) {
      patterns = [config.globPattern];
    }

    if (!patterns) {
      throw new Error('No glob patterns detected in configuration file');
    }

    this.globPatterns = patterns;
  }

  async runOnce() {
    const initialFileEvent = this.buildInitialFileEvent();

    const handledFileEvents = this.handleFileEvents(initialFileEvent);

    return await firstValueFrom(handledFileEvents);
  }

  watch() {
    const fileEvents = concat(
      this.buildInitialFileEvent(),
      this.buildWatcher(),
    );

    const handledFileEvents = this.handleFileEvents(fileEvents).pipe(
      shareReplay(1),
    );

    handledFileEvents.pipe(take(1)).subscribe(() => {
      console.log(blue('Watching doc-portal files for changes...\n'));
    });

    return handledFileEvents;
  }

  handleFileEvents(obs: Observable<RawFileEvent>) {
    return obs.pipe(
      concatMap((event) => this.addPayloadToEvent(event)),
      filter((fileEvent): fileEvent is ProcessedFileEvent => !!fileEvent),
      scan(accumulatePayloads, new Array<EventPayload>()),
      debounceTime(500),
      map((payloads) => this.detectAndHandleDuplicateTitles(payloads)),
      map((eventPayloads) =>
        eventPayloads.map((eventPayload) =>
          generateDocPageLoader(eventPayload.filePath, eventPayload.title),
        ),
      ),
      map(wrapTypescriptBoilerplate),
      switchMap((content) => formatContent(content)),
      switchMap((content) => this.writeDynamicPageContentToFile(content)),
    );
  }

  /**
   * Build an Observable that emits the initial list of file paths.
   * @private
   */
  private buildInitialFileEvent(): Observable<RawInitEvent> {
    this.log(blue('Searching for component document page files...'));
    const startTime = Date.now();

    const patternStrings = convertPatternOrGlobPatternArray(this.globPatterns);

    return from(
      glob(patternStrings, {
        unique: true,
        dot: true,
        onlyFiles: true,
        ignore: ['node_modules'],
      }),
    ).pipe(
      map((filePaths): RawInitEvent => ({ type: 'init', filePaths })),
      tap(() => {
        const endTime = Date.now();
        this.log(green(`Searching complete in ${endTime - startTime}ms\n`));
      }),
    );
  }

  /**
   * Generate an Observable of the raw file events.
   * @private
   */
  private buildWatcher(): Observable<RawFileEvent> {
    return new Observable<RawFileEvent>((observer) => {
      const patternStrings = convertPatternOrGlobPatternArray(
        this.globPatterns,
      );

      const watcher = watch(patternStrings, {
        ignored: 'node_modules',
        ignoreInitial: true,
      }).on('all', async (event, rawFilePath) => {
        observer.next(this.buildRawFileEvent(rawFilePath, event));
      });

      return () => {
        watcher.unwatch(patternStrings);
        watcher.close();
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
    event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
  ): RawFileEvent {
    const filePath = rawFilePath.replace(/\\/g, '/');
    if (event === 'add' || event === 'addDir') {
      this.log(green(`${timeNow()} - ADDED - ${filePath}`));
      return { type: 'add', filePath };
    } else if (event === 'unlink' || event === 'unlinkDir') {
      this.log(red(`${timeNow()} - DELETED - ${filePath}`));
      return { type: 'unlink', filePath };
    } else {
      this.log(yellow(`${timeNow()} - CHANGED - ${filePath}`));
      return { type: 'change', filePath };
    }
  }

  /**
   * Process a raw file event, adding loader string payloads.
   *
   * @param fileEvent The raw file event that describe which file(s)
   * is affected and what is happening.
   * @private
   */
  private async addPayloadToEvent(
    fileEvent: RawFileEvent,
  ): Promise<ProcessedFileEvent | null> {
    try {
      if (fileEvent.type === 'init') {
        const payload: EventPayload[] = [];
        this.log(blue('Compiling component document page files...'));
        const startTime = Number(new Date());
        for (const filePath of fileEvent.filePaths) {
          const title = await extractTitleFromDocPageFile(
            filePath,
            this.globPatterns,
          );
          payload.push({ filePath, title });
        }
        const endTime = Number(new Date());
        this.log(
          green(
            `Finished compiling component document page files in ${
              endTime - startTime
            }ms\n`,
          ),
        );
        return { ...fileEvent, payload };
      } else if (fileEvent.type === 'add' || fileEvent.type === 'change') {
        const startTime = Date.now();
        const title = await extractTitleFromDocPageFile(
          fileEvent.filePath,
          this.globPatterns,
        );
        const endTime = Date.now();
        this.log(
          blue(
            `${timeNow()} - COMPILE - recompiled in ${endTime - startTime}ms`,
          ),
        );
        return { ...fileEvent, title };
      } else {
        return fileEvent;
      }
    } catch (error) {
      this.log(red(`Unexpected error occurred while compiling...\n${error}`));
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
          yellow(
            `Duplicated title of "${payload.title}" detected in file '${payload.filePath}'`,
          ),
        );
        payload.title += ` ${++titles[payload.title]}`;
      }
      titles[payload.title] = 1;
    }
    if (duplicatesDetected) {
      this.log(
        yellow('\nPlease resolve duplicated titles before publishing!\n'),
      );
    }
    return eventPayloads;
  }

  /**
   * Generate a file to hold the loader content.
   *
   * @param content The loader content generated from our path files
   * @private
   */
  private async writeDynamicPageContentToFile(content: string) {
    try {
      writeFileSync(this.docPageLoadersFileLocation, content);
    } catch (e) {
      console.error(e);
      this.log(
        red(
          `\n\nUnexpected error occurred while generating doc-page-loaders.ts\n`,
        ),
      );
    }
  }

  private log(message: string) {
    if (!this.silenced) {
      console.log(message);
    }
  }
}
