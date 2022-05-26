/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs/promises';
import glob from 'glob-promise';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { delay, firstValueFrom, of } from 'rxjs';

import { CONFIG_FILE_LOCATION } from './constants';
import { DocPageConfigsCompiler } from './doc-page-configs-compiler';
import { RawInitEvent, RawAddEvent, UnlinkEvent, EventPayload } from './types';

jest.mock('./util', () => {
  const originalModule = jest.requireActual('./util');

  return {
    ...originalModule,
    extractTitleFromDocPageFile: jest.fn().mockResolvedValue('title'),
  };
});

describe(DocPageConfigsCompiler, () => {
  describe('methods', () => {
    let compiler: DocPageConfigsCompiler;
    let extractTitleFromDocPageFileMock: jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();

      extractTitleFromDocPageFileMock =
        jest.requireMock('./util').extractTitleFromDocPageFile;

      compiler = new DocPageConfigsCompiler('lazy', true, false);

      jest.spyOn(compiler as any, 'log');
    });

    describe('content', () => {
      it('should handle without watching', async () => {
        // Arrange
        jest.spyOn(compiler as any, 'buildInitialFileEvent').mockReturnValue(
          of({
            type: 'init',
            filePaths: ['file1', 'dir/file2'],
          } as RawInitEvent)
        );

        // Act
        const result = await firstValueFrom(compiler['content']);

        // Assert
        expect(result)
          .toEqual(`import { LazyDocConfigRecord, CompilerMode } from '@cdp/component-document-portal/util-types';

export const docPageConfigs = {
  title: {
    mode: 'lazy',
    title: 'title',
    loadConfig: () => import('../../../../file1').then((file) => file.default),
  },
  'title-2': {
    mode: 'lazy',
    title: 'title 2',
    loadConfig: () => import('../../../../dir/file2').then((file) => file.default),
  },
} as LazyDocConfigRecord;
export const applicationMode: CompilerMode = 'lazy';
`);
      });

      it('should handle with watching', async () => {
        // Arrange
        compiler = new DocPageConfigsCompiler('lazy', true, false);
        jest.spyOn(compiler as any, 'log');
        jest.spyOn(compiler as any, 'buildWatcher').mockReturnValue(
          of({
            type: 'add',
            filePath: 'file3',
          } as RawAddEvent).pipe(delay(1))
        );
        jest.spyOn(compiler as any, 'buildInitialFileEvent').mockReturnValue(
          of({
            type: 'init',
            filePaths: ['file1', 'dir/file2'],
          } as RawInitEvent)
        );

        // Act
        const result = await firstValueFrom(compiler['content']);

        // Assert
        expect(result)
          .toEqual(`import { LazyDocConfigRecord, CompilerMode } from '@cdp/component-document-portal/util-types';

export const docPageConfigs = {
  title: {
    mode: 'lazy',
    title: 'title',
    loadConfig: () => import('../../../../file1').then((file) => file.default),
  },
  'title-2': {
    mode: 'lazy',
    title: 'title 2',
    loadConfig: () => import('../../../../dir/file2').then((file) => file.default),
  },
  'title-3': {
    mode: 'lazy',
    title: 'title 3',
    loadConfig: () => import('../../../../file3').then((file) => file.default),
  },
} as LazyDocConfigRecord;
export const applicationMode: CompilerMode = 'lazy';
`);
      });
    });

    describe('compile', () => {
      it('should handle the happy case', async () => {
        // Arrange
        jest.spyOn(fs, 'writeFile');
        (compiler['content'] as any) = of('content');

        // Act
        await compiler.compile();

        // Assert
        expect(fs.writeFile).toHaveBeenCalledWith(
          './apps/component-document-portal/src/app/doc-page-configs.ts',
          'content'
        );
      });
    });

    describe('buildInitialFileEvent', () => {
      it('should handle the happy case', async () => {
        // Arrange
        jest.spyOn(glob, 'promise').mockResolvedValue(['file1', 'file2']);

        // Act
        const observerSpy = subscribeSpyTo(compiler['buildInitialFileEvent']());
        await observerSpy.onComplete();

        // Assert
        expect(observerSpy.getValuesLength()).toEqual(1);
        expect(observerSpy.getFirstValue()).toEqual({
          filePaths: ['file1', 'file2'],
          type: 'init',
        });
        expect(compiler['log']).toHaveBeenCalledTimes(2);
      });
    });

    describe('buildRawFileEvent', () => {
      it.each(['add' as const, 'addDir' as const])(
        'should handle %s',
        (event) => {
          // Arrange

          // Act
          const result = compiler['buildRawFileEvent']('dir\\file', event);

          // Assert
          expect(result).toEqual({
            filePath: 'dir/file',
            type: 'add',
          });
          expect(compiler['log']).toHaveBeenCalledTimes(1);
        }
      );

      it.each(['unlink' as const, 'unlinkDir' as const])(
        'should handle %s',
        (event) => {
          // Arrange

          // Act
          const result = compiler['buildRawFileEvent']('dir\\file', event);

          // Assert
          expect(result).toEqual({
            filePath: 'dir/file',
            type: 'unlink',
          });
          expect(compiler['log']).toHaveBeenCalledTimes(1);
        }
      );

      it('should handle change', () => {
        // Arrange

        // Act
        const result = compiler['buildRawFileEvent'](
          'dir\\subdir\\file',
          'change'
        );

        // Assert
        expect(result).toEqual({
          filePath: 'dir/subdir/file',
          type: 'change',
        });
        expect(compiler['log']).toHaveBeenCalledTimes(1);
      });
    });

    describe('addPayloadToEvent', () => {
      it('should handle an init event', async () => {
        // Arrange
        const event: RawInitEvent = {
          type: 'init',
          filePaths: ['path1', 'path2'],
        };

        // Act
        const result = await compiler['addPayloadToEvent'](event);

        // Assert
        expect(result).toEqual({
          ...event,
          payload: [
            {
              title: 'title',
              filePath: 'path1',
            },
            {
              title: 'title',
              filePath: 'path2',
            },
          ],
        });
        expect(extractTitleFromDocPageFileMock).toHaveBeenCalledTimes(2);
        expect(compiler['log']).toHaveBeenCalledTimes(2);
      });

      it.each(['add' as const, 'change' as const])(
        'should handle a %s event',
        async (type) => {
          // Arrange
          extractTitleFromDocPageFileMock.mockResolvedValue('title1');
          const event = {
            type,
            filePath: 'path1',
          };

          // Act
          const result = await compiler['addPayloadToEvent'](event);

          // Assert
          expect(result).toEqual({
            ...event,
            title: 'title1',
          });
          expect(extractTitleFromDocPageFileMock).toHaveBeenCalledTimes(1);
          expect(compiler['log']).toHaveBeenCalledTimes(1);
        }
      );

      it('should handle an unlink event', async () => {
        // Arrange
        const event: UnlinkEvent = {
          type: 'unlink',
          filePath: 'path1',
        };

        // Act
        const result = await compiler['addPayloadToEvent'](event);

        // Assert
        expect(result).toBe(event);
        expect(extractTitleFromDocPageFileMock).not.toHaveBeenCalled();
        expect(compiler['log']).not.toHaveBeenCalled();
      });

      it('should handle an error', async () => {
        // Arrange
        const event: RawInitEvent = {
          type: 'init',
          filePaths: ['path1', 'path2'],
        };
        extractTitleFromDocPageFileMock
          .mockResolvedValueOnce('title1')
          .mockRejectedValue('oops');

        // Act
        const result = await compiler['addPayloadToEvent'](event);

        // Assert
        expect(result).toBeNull();
        expect(extractTitleFromDocPageFileMock).toHaveBeenCalledTimes(2);
        expect(compiler['log']).toHaveBeenCalledTimes(2);
      });
    });

    describe('writeDynamicPageContentToFile', () => {
      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation();
      });

      it('should handle the happy case', async () => {
        // Arrange
        jest.spyOn(fs, 'writeFile').mockResolvedValue();

        // Act
        await compiler['writeDynamicPageContentToFile']('all the content');

        // Assert
        expect(fs.writeFile).toHaveBeenCalledWith(
          CONFIG_FILE_LOCATION,
          'all the content'
        );
        expect(console.error).not.toHaveBeenCalled();
        expect(compiler['log']).not.toHaveBeenCalled();
      });

      it('should handle a file error', async () => {
        // Arrange
        jest.spyOn(fs, 'writeFile').mockRejectedValue('oops');

        // Act
        await compiler['writeDynamicPageContentToFile']('all the content');

        // Assert
        expect(fs.writeFile).toHaveBeenCalledWith(
          CONFIG_FILE_LOCATION,
          'all the content'
        );
        expect(console.error).toHaveBeenCalledWith('oops');
        expect(compiler['log']).toHaveBeenCalled();
      });
    });

    describe('detectAndHandleDuplicateTitles', () => {
      it('should do nothing if there are no duplicate titles', () => {
        const eventPayloads: EventPayload[] = [
          {
            filePath: 'hello-world',
            title: 'Hello World',
          },
          {
            filePath: 'foo-bar',
            title: 'Foo Bar',
          },
        ];

        const alteredPayloads =
          compiler['detectAndHandleDuplicateTitles'](eventPayloads);

        expect(alteredPayloads).toEqual(eventPayloads);
        expect(compiler['log']).not.toHaveBeenCalled();
      });

      it('should log & alter the duplicate titles found', () => {
        const eventPayloads: EventPayload[] = [
          {
            filePath: 'blah/test12',
            title: 'test',
          },
          {
            filePath: 'blah/test21',
            title: 'test',
          },
          {
            filePath: 'blah/test35',
            title: 'test',
          },
        ];

        const expectedPayloads: EventPayload[] = [
          {
            filePath: 'blah/test12',
            title: 'test',
          },
          {
            filePath: 'blah/test21',
            title: 'test 2',
          },
          {
            filePath: 'blah/test35',
            title: 'test 3',
          },
        ];

        const alteredPayloads =
          compiler['detectAndHandleDuplicateTitles'](eventPayloads);

        expect(alteredPayloads).toEqual(expectedPayloads);
        expect(compiler['log']).toHaveBeenCalledTimes(3);
      });
    });
  });
});
