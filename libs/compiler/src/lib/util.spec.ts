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
