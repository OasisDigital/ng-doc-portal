import ts from 'typescript';

import * as utilFunctions from './util';

import fs from 'fs/promises';


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

describe('util functions', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('accumulatePayloads', () => {
    it('should handle init', () => {
      // Arrange

      // Act
      const payload = [
        { filePath: 'path1', title: 'title1' },
        { filePath: 'path2', title: 'title2' },
      ];
      const result = utilFunctions.accumulatePayloads(
        [{ filePath: 'existing', title: 'existing' }],
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
      const result = utilFunctions.accumulatePayloads(
        [{ filePath: 'existing', title: 'existing' }],
        {
          type: 'add',
          filePath: 'path1',
          title: 'title1',
        }
      );

      // Assert
      expect(result).toEqual([
        {
          title: 'existing',
          filePath: 'existing',
        },
        {
          title: 'title1',
          filePath: 'path1',
        },
      ]);
    });

    it('should handle change happy case', () => {
      // Arrange

      // Act
      const result = utilFunctions.accumulatePayloads(
        [
          { filePath: 'existing', title: 'existing' },
          { filePath: 'path1', title: 'existing1' },
        ],
        {
          type: 'change',
          filePath: 'path1',
          title: 'title1',
        }
      );

      // Assert
      expect(result).toEqual([
        {
          title: 'existing',
          filePath: 'existing',
        },
        {
          title: 'title1',
          filePath: 'path1',
        },
      ]);
    });

    it('should handle change not finding the path', () => {
      // Arrange
      const initial = [
        { filePath: 'existing', title: 'existing' },
        { filePath: 'path1', title: 'existing1' },
      ];

      // Act
      const result = utilFunctions.accumulatePayloads(initial, {
        type: 'change',
        filePath: 'path2',
        title: 'title2',
      });

      // Assert
      expect(result).toEqual(initial);
    });

    it('should handle the unlink happy case', () => {
      // Arrange
      const initial = [
        { filePath: 'existing', title: 'existing' },
        { filePath: 'path1', title: 'existing1' },
      ];

      // Act
      const result = utilFunctions.accumulatePayloads(initial, {
        type: 'unlink',
        filePath: 'path1',
      });

      // Assert
      expect(result).toEqual([{ filePath: 'existing', title: 'existing' }]);
    });

    it('should handle unlink not finding the path', () => {
      // Arrange
      const initial = [
        { filePath: 'existing', title: 'existing' },
        { filePath: 'path1', title: 'existing1' },
      ];

      // Act
      const result = utilFunctions.accumulatePayloads(initial, {
        type: 'unlink',
        filePath: 'path2',
      });

      // Assert
      expect(result).toEqual(initial);
    });
  });

  describe('extractTitleConfigFromDocPageFile', () => {
    it('should handle the happy case', async () => {
      // Arrange
      jest.spyOn(fs, 'readFile').mockResolvedValue(mockFile);

      // Act
      const result = await utilFunctions.extractTitleFromDocPageFile('file');

      // Assert
      expect(result.toString()).toEqual('General/Button');
    });
  });

  describe('generateDocPageConfig', () => {
    it('should bring the values together', () => {
      // Arrange

      // Act
      const result = utilFunctions.generateDocPageConfig(
        'myFile.ts',
        'Context/This is my title'
      );

      // Assert
      expect(result.toString()).toEqual(
        `
    'context-this-is-my-title': {
      mode: 'lazy',
      title: 'Context/This is my title',
      loadConfig: () => import('../../../../myFile').then((file) => file.default)
    }
`
      );
    });
  });

  describe('findTitle', () => {
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
        .spyOn(utilFunctions, 'findStatementWithTitle')
        .mockReturnValue(statement);
      jest
        .spyOn(utilFunctions, 'recursivelyFindTitle')
        .mockReturnValue("'foo'");

      // Act
      const result = utilFunctions.findTitle(sourceFile, 'file');

      // Assert
      expect(result).toEqual('foo');
    });

    it('should handle not finding the statement', () => {
      // Arrange
      const sourceFile: ts.SourceFile = {} as ts.SourceFile;
      jest
        .spyOn(utilFunctions, 'findStatementWithTitle')
        .mockReturnValue(undefined);

      // Act
      const result = () => utilFunctions.findTitle(sourceFile, 'file');

      // Assert
      expect(result).toThrow('Could not find doc page config export from file');
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
        .spyOn(utilFunctions, 'findStatementWithTitle')
        .mockReturnValue(statement);
      jest.spyOn(utilFunctions, 'recursivelyFindTitle').mockReturnValue(null);

      // Act
      const result = () => utilFunctions.findTitle(sourceFile, 'file');

      // Assert
      expect(result).toThrow('Could not find title in page config for file...');
    });
  });

  describe('findStatementWithTitle', () => {
    it('should handle not finding anything', () => {
      // Arrange
      const statements: ReadonlyArray<ts.Statement> = Object.freeze([]);
      const sourceFile: ts.SourceFile = {} as ts.SourceFile;

      // Act
      const result = utilFunctions.findStatementWithTitle(
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
      const result = utilFunctions.findStatementWithTitle(
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
      const result = utilFunctions.findStatementWithTitle(
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
      const result = utilFunctions.findStatementWithTitle(
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
      const result = utilFunctions.findStatementWithTitle(
        statements,
        sourceFile
      );

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('recursivelyFindTitle', () => {
    let sourceFile: ts.SourceFile;
    beforeEach(() => {
      sourceFile = {} as ts.SourceFile;
    });

    it('should find for a String Literal', () => {
      // Arrange
      const node = conjureLeafMatch();

      // Act
      const result = utilFunctions.recursivelyFindTitle(node, sourceFile);

      // Assert
      expect(result).toBe('foo');
      expect(node.getChildren).toHaveBeenCalledWith(sourceFile);
      expect(node.getText).toHaveBeenCalledWith(sourceFile);
    });

    it('should handle a non-String Literal leaf', () => {
      // Arrange
      const node = conjureLeafNonMatch();

      // Act
      const result = utilFunctions.recursivelyFindTitle(node, sourceFile);

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
      const result = utilFunctions.recursivelyFindTitle(node, sourceFile);

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
      const result = utilFunctions.recursivelyFindTitle(node, sourceFile);

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

  describe('formatContent', () => {
    it('should handle the happy case', () => {
      // Arrange
      const mockFileContent = `
              import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

      export const docPageConfigs  =    {
           title1: {},
        title2: {},
      } as Record<string, DynamicDocPageConfig>;
      `;

      // Act
      const result = utilFunctions.formatContent(mockFileContent);

      // Assert
      expect(result)
        .toEqual(`import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

export const docPageConfigs = {
  title1: {},
  title2: {},
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
