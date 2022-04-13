/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CONFIG_FILE_LOCATION,
  DocPageConfigsCompiler,
  exportedForTesting,
  RawAddEvent,
  RawInitEvent,
  UnlinkEvent,
} from './doc-page-configs-compiler';
import fs from 'fs/promises';
import glob from 'glob-promise';
import ts from 'typescript';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { delay, firstValueFrom, of } from 'rxjs';

const mockFile = `
import { Component, NgModule } from '@angular/core';

import { DocPageConfig } from '@cdp/component-document-portal/util-types';
import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';

@Component({
  template: 'Foo template',
})
export class ButtonDocumentPageComponent {}

@NgModule({
  declarations: [ButtonDocumentPageComponent],
  imports: [DocComponentsModule],
})
export class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;`;

describe(DocPageConfigsCompiler, () => {
  describe('methods', () => {
    let compiler: DocPageConfigsCompiler;

    beforeEach(() => {
      compiler = new DocPageConfigsCompiler(false, true);
      jest.spyOn(compiler as any, 'log');
    });

    describe('content', () => {
      beforeEach(() => {
        jest
          .spyOn(exportedForTesting, 'compileDynamicDocPageConfigString')
          .mockImplementation((filePath) =>
            Promise.resolve(`['${filePath}']: 'config'`)
          );
      });

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
          .toEqual(`import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

export const docPageConfigs = {
  ['file1']: 'config',
  ['dir/file2']: 'config',
} as Record<string, DynamicDocPageConfig>;
`);
      });

      it('should handle with watching', async () => {
        // Arrange
        compiler = new DocPageConfigsCompiler(true, true);
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
          .toEqual(`import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

export const docPageConfigs = {
  ['file1']: 'config',
  ['dir/file2']: 'config',
  ['file3']: 'config',
} as Record<string, DynamicDocPageConfig>;
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
      beforeEach(() => {
        jest.resetAllMocks();
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should handle an init event', async () => {
        // Arrange
        const event: RawInitEvent = {
          type: 'init',
          filePaths: ['path1', 'path2'],
        };
        jest
          .spyOn(exportedForTesting, 'compileDynamicDocPageConfigString')
          .mockResolvedValueOnce('config1')
          .mockResolvedValueOnce('config2');

        // Act
        const result = await compiler['addPayloadToEvent'](event);

        // Assert
        expect(result).toEqual({
          ...event,
          payload: [
            {
              configString: 'config1',
              filePath: 'path1',
            },
            {
              configString: 'config2',
              filePath: 'path2',
            },
          ],
        });
        expect(
          exportedForTesting.compileDynamicDocPageConfigString
        ).toHaveBeenCalledTimes(2);
        expect(compiler['log']).toHaveBeenCalledTimes(2);
      });

      it.each(['add' as const, 'change' as const])(
        'should handle a %s event',
        async (type) => {
          // Arrange
          jest
            .spyOn(exportedForTesting, 'compileDynamicDocPageConfigString')
            .mockResolvedValue('config1');
          const event = {
            type,
            filePath: 'path1',
          };

          // Act
          const result = await compiler['addPayloadToEvent'](event);

          // Assert
          expect(result).toEqual({
            ...event,
            configString: 'config1',
          });
          expect(
            exportedForTesting.compileDynamicDocPageConfigString
          ).toHaveBeenCalledTimes(1);
          expect(compiler['log']).toHaveBeenCalledTimes(1);
        }
      );

      it('should handle an unlink event', async () => {
        // Arrange
        const event: UnlinkEvent = {
          type: 'unlink',
          filePath: 'path1',
        };
        jest.spyOn(exportedForTesting, 'compileDynamicDocPageConfigString');

        // Act
        const result = await compiler['addPayloadToEvent'](event);

        // Assert
        expect(result).toBe(event);
        expect(
          exportedForTesting.compileDynamicDocPageConfigString
        ).not.toHaveBeenCalled();
        expect(compiler['log']).not.toHaveBeenCalled();
      });

      it('should handle an error', async () => {
        // Arrange
        const event: RawInitEvent = {
          type: 'init',
          filePaths: ['path1', 'path2'],
        };
        jest
          .spyOn(exportedForTesting, 'compileDynamicDocPageConfigString')
          .mockResolvedValueOnce('config1')
          .mockRejectedValue('oops');

        // Act
        const result = await compiler['addPayloadToEvent'](event);

        // Assert
        expect(result).toBeNull();
        expect(
          exportedForTesting.compileDynamicDocPageConfigString
        ).toHaveBeenCalledTimes(2);
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
  });

  describe('functions', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe(exportedForTesting.accumulatePayloads, () => {
      it('should handle init', () => {
        // Arrange

        // Act
        const payload = [
          { filePath: 'path1', configString: 'config1' },
          { filePath: 'path2', configString: 'config2' },
        ];
        const result = exportedForTesting.accumulatePayloads(
          [{ filePath: 'existing', configString: 'existing' }],
          {
            type: 'init',
            filePaths: ['path1', 'path2'],
            payload,
          }
        );

        // Assert
        expect(result).toBe(payload); // exising is blown away
      });

      it('should handle add', () => {
        // Arrange

        // Act
        const result = exportedForTesting.accumulatePayloads(
          [{ filePath: 'existing', configString: 'existing' }],
          {
            type: 'add',
            filePath: 'path1',
            configString: 'config1',
          }
        );

        // Assert
        expect(result).toEqual([
          {
            configString: 'existing',
            filePath: 'existing',
          },
          {
            configString: 'config1',
            filePath: 'path1',
          },
        ]);
      });

      it('should handle change happy case', () => {
        // Arrange

        // Act
        const result = exportedForTesting.accumulatePayloads(
          [
            { filePath: 'existing', configString: 'existing' },
            { filePath: 'path1', configString: 'existing1' },
          ],
          {
            type: 'change',
            filePath: 'path1',
            configString: 'config1',
          }
        );

        // Assert
        expect(result).toEqual([
          {
            configString: 'existing',
            filePath: 'existing',
          },
          {
            configString: 'config1',
            filePath: 'path1',
          },
        ]);
      });

      it('should handle change not finding the path', () => {
        // Arrange
        const initial = [
          { filePath: 'existing', configString: 'existing' },
          { filePath: 'path1', configString: 'existing1' },
        ];

        // Act
        const result = exportedForTesting.accumulatePayloads(initial, {
          type: 'change',
          filePath: 'path2',
          configString: 'config2',
        });

        // Assert
        expect(result).toEqual(initial);
      });

      it('should handle the unlink happy case', () => {
        // Arrange
        const initial = [
          { filePath: 'existing', configString: 'existing' },
          { filePath: 'path1', configString: 'existing1' },
        ];

        // Act
        const result = exportedForTesting.accumulatePayloads(initial, {
          type: 'unlink',
          filePath: 'path1',
        });

        // Assert
        expect(result).toEqual([
          { filePath: 'existing', configString: 'existing' },
        ]);
      });

      it('should handle unlink not finding the path', () => {
        // Arrange
        const initial = [
          { filePath: 'existing', configString: 'existing' },
          { filePath: 'path1', configString: 'existing1' },
        ];

        // Act
        const result = exportedForTesting.accumulatePayloads(initial, {
          type: 'unlink',
          filePath: 'path2',
        });

        // Assert
        expect(result).toEqual(initial);
      });
    });

    describe(exportedForTesting.compileDynamicDocPageConfigString, () => {
      it('should handle the happy case', async () => {
        // Arrange
        jest.spyOn(fs, 'readFile').mockResolvedValue(mockFile);

        // Act
        const result =
          await exportedForTesting.compileDynamicDocPageConfigString('file');

        // Assert
        expect(result.toString()).toEqual(`
      'general-button': {
        title: 'General/Button',
        loadConfig: () => import('../../../../file').then((file) => file.default)
      }
    `);
      });
    });

    describe(exportedForTesting.generateDocPageConfig, () => {
      it('should bring the values together', () => {
        // Arrange

        // Act
        const result = exportedForTesting.generateDocPageConfig(
          'myFile.ts',
          'Context/This is my title'
        );

        // Assert
        expect(result.toString()).toEqual(
          `
      'context-this-is-my-title': {
        title: 'Context/This is my title',
        loadConfig: () => import('../../../../myFile').then((file) => file.default)
      }
    `
        );
      });
    });

    describe(exportedForTesting.findTitle, () => {
      it('should handle the happy case', () => {
        // Arrange
        const sourceFile: ts.SourceFile = {} as ts.SourceFile;
        const statement = conjureStatement(
          `const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};
`
        );
        jest
          .spyOn(exportedForTesting, 'findStatementWithTitle')
          .mockReturnValue(statement);
        jest
          .spyOn(exportedForTesting, 'recursivelyFindTitle')
          .mockReturnValue("'foo'");

        // Act
        const result = exportedForTesting.findTitle(sourceFile, 'file');

        // Assert
        expect(result).toEqual('foo');
      });

      it('should handle not finding the statement', () => {
        // Arrange
        const sourceFile: ts.SourceFile = {} as ts.SourceFile;
        jest
          .spyOn(exportedForTesting, 'findStatementWithTitle')
          .mockReturnValue(undefined);

        // Act
        const result = () => exportedForTesting.findTitle(sourceFile, 'file');

        // Assert
        expect(result).toThrow(
          'Could not find doc page config export from file'
        );
      });

      it('should handle not finding the title', () => {
        // Arrange
        const sourceFile: ts.SourceFile = {} as ts.SourceFile;
        const statement = conjureStatement(
          `const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};
`
        );
        jest
          .spyOn(exportedForTesting, 'findStatementWithTitle')
          .mockReturnValue(statement);
        jest
          .spyOn(exportedForTesting, 'recursivelyFindTitle')
          .mockReturnValue(null);

        // Act
        const result = () => exportedForTesting.findTitle(sourceFile, 'file');

        // Assert
        expect(result).toThrow(
          'Could not find title in page config for file...'
        );
      });
    });

    describe(exportedForTesting.findStatementWithTitle, () => {
      it('should handle not finding anything', () => {
        // Arrange
        const statements: ReadonlyArray<ts.Statement> = Object.freeze([]);
        const sourceFile: ts.SourceFile = {} as ts.SourceFile;

        // Act
        const result = exportedForTesting.findStatementWithTitle(
          statements,
          sourceFile
        );

        // Assert
        expect(result).toBeUndefined();
      });

      it('should handle skipping the import', () => {
        // Arrange
        const statements: ReadonlyArray<ts.Statement> = Object.freeze([
          conjureStatement(
            "import { DocPageConfig } from '@cdp/component-document-portal/util-types';\n"
          ),
        ]);
        const sourceFile: ts.SourceFile = {} as ts.SourceFile;

        // Act
        const result = exportedForTesting.findStatementWithTitle(
          statements,
          sourceFile
        );

        // Assert
        expect(result).toBeUndefined();
      });

      it('should handle finding the const', () => {
        // Arrange
        const statements: ReadonlyArray<ts.Statement> = Object.freeze([
          conjureStatement(
            "import { DocPageConfig } from '@cdp/component-document-portal/util-types';\n"
          ),
          conjureStatement(
            `const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};
`
          ),
        ]);
        const sourceFile: ts.SourceFile = {} as ts.SourceFile;

        // Act
        const result = exportedForTesting.findStatementWithTitle(
          statements,
          sourceFile
        );

        // Assert
        expect(result).toBe(statements[1]);
      });

      it('should handle finding direct export', () => {
        // Arrange
        const statements: ReadonlyArray<ts.Statement> = Object.freeze([
          conjureStatement(
            `export default {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};`
          ),
        ]);
        const sourceFile: ts.SourceFile = {} as ts.SourceFile;

        // Act
        const result = exportedForTesting.findStatementWithTitle(
          statements,
          sourceFile
        );

        // Assert
        expect(result).toBe(statements[0]);
      });

      it('should handle the const not having the title', () => {
        // Arrange
        const statements: ReadonlyArray<ts.Statement> = Object.freeze([
          conjureStatement(
            "import { DocPageConfig } from '@cdp/component-document-portal/util-types';\n"
          ),
          conjureStatement(
            `const docPageConfig: DocPageConfig = {
  docPageComponent: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};
`
          ),
        ]);
        const sourceFile: ts.SourceFile = {} as ts.SourceFile;

        // Act
        const result = exportedForTesting.findStatementWithTitle(
          statements,
          sourceFile
        );

        // Assert
        expect(result).toBeUndefined();
      });
    });

    describe(exportedForTesting.recursivelyFindTitle, () => {
      let sourceFile: ts.SourceFile;
      beforeEach(() => {
        sourceFile = {} as ts.SourceFile;
      });

      it('should find for a String Literal', () => {
        // Arrange
        const node = conjureLeafMatch();

        // Act
        const result = exportedForTesting.recursivelyFindTitle(
          node,
          sourceFile
        );

        // Assert
        expect(result).toBe('foo');
        expect(node.getChildren).toHaveBeenCalledWith(sourceFile);
        expect(node.getText).toHaveBeenCalledWith(sourceFile);
      });

      it('should handle a non-String Literal leaf', () => {
        // Arrange
        const node = conjureLeafNonMatch();

        // Act
        const result = exportedForTesting.recursivelyFindTitle(
          node,
          sourceFile
        );

        // Assert
        expect(result).toBeNull();
        expect(node.getChildren).toHaveBeenCalledWith(sourceFile);
      });

      it('should handle non-leaf w/o match', () => {
        // Arrange
        const children = [conjureLeafNonMatch()];
        const node: ts.Node = {
          getChildren: jest.fn(() => children) as getChildrenType,
        } as ts.Node;

        // Act
        const result = exportedForTesting.recursivelyFindTitle(
          node,
          sourceFile
        );

        // Assert
        expect(result).toBeNull();
        expect(node.getChildren).toHaveBeenCalledWith(sourceFile);
        expect(children[0].getChildren).toHaveBeenCalledWith(sourceFile);
      });

      it('should handle non-leaf with match', () => {
        // Arrange
        const children = [conjureLeafNonMatch(), conjureLeafMatch()];
        const node: ts.Node = {
          getChildren: jest.fn(() => children) as getChildrenType,
        } as ts.Node;

        // Act
        const result = exportedForTesting.recursivelyFindTitle(
          node,
          sourceFile
        );

        // Assert
        expect(result).toBe('foo');
        expect(node.getChildren).toHaveBeenCalledWith(sourceFile);
        expect(children[0].getChildren).toHaveBeenCalledWith(sourceFile);
        expect(children[1].getChildren).toHaveBeenCalledWith(sourceFile);
        expect(children[1].getText).toHaveBeenCalledWith(sourceFile);
      });

      type getChildrenType = (_sourceFile?: ts.SourceFile) => Array<ts.Node>;

      function conjureLeafNonMatch(): ts.Node {
        return {
          kind: ts.SyntaxKind.ColonToken,
          getChildren: jest.fn(() => Array<ts.Node>()) as getChildrenType,
        } as ts.Node;
      }

      function conjureLeafMatch(): ts.Node {
        return {
          kind: ts.SyntaxKind.StringLiteral,
          getChildren: jest.fn(() => Array<ts.Node>()) as getChildrenType,
          getText: jest.fn(() => 'foo') as (
            _sourceFile?: ts.SourceFile
          ) => string,
        } as ts.Node;
      }
    });

    describe(exportedForTesting.formatContent, () => {
      it('should handle the happy case', () => {
        // Arrange

        // Act
        const result = exportedForTesting.formatContent(['string1', 'string2']);

        // Assert
        expect(result)
          .toEqual(`import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

export const docPageConfigs = {
  string1,
  string2,
} as Record<string, DynamicDocPageConfig>;
`);
      });
    });
  });

  function conjureStatement(text: string) {
    return {
      getText: jest.fn(() => text) as (_sourceFile?: ts.SourceFile) => string,
    } as ts.Statement;
  }
});
