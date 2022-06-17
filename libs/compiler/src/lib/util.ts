import { tsquery } from '@phenomnomnominal/tsquery';
import { format } from 'date-fns';
import prettier from 'prettier';

import { EventPayload, ProcessedFileEvent, RawFileEvent } from './types';

import fs from 'fs/promises';
import path from 'path';

/**
 * Extract all the payloads from the various processed file events.
 *
 * @param acc The previous accumulated payloads
 * @param curr The current file event
 */
export function accumulatePayloads(
  acc: EventPayload[],
  curr: ProcessedFileEvent
): EventPayload[] {
  if (curr.type === 'init') {
    return curr.payload;
  } else if (curr.type === 'add') {
    return [...acc, { filePath: curr.filePath, title: curr.title }];
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
      title: curr.title,
    };
    return copy;
  }
  // Can't happen, but needed for the compiler
  return [];
}

export function createRuntimeConfig(filePaths: string[]) {
  let arrayStringContent = '';
  for (const filePath of filePaths) {
    const splitPath = filePath.split('.ts');
    arrayStringContent =
      arrayStringContent +
      `() => import('../../../../${splitPath[0]}').then(
      (file) => file.default
    ),`;
  }

  return `
    import { RuntimeDocConfigArray, CompilerMode } from '@cdp/component-document-portal/util-types';

    export const compilerMode: CompilerMode = 'runtime';

    export const docPageConfigs = [
      ${arrayStringContent}
    ] as RuntimeDocConfigArray;
  `;
}

/**
 * Extract all the filePaths from the various processed file events.
 *
 * @param acc The previous accumulated filePaths
 * @param curr The current file event
 */
export function accumulateFilePaths(
  acc: string[],
  curr: RawFileEvent
): string[] {
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

export function generateTitleFromFilePath(filePath: string) {
  const baseName = path.basename(filePath);
  const fileName = baseName.substring(0, baseName.indexOf('.'));
  return fileName.charAt(0).toUpperCase() + fileName.substring(1);
}

/**
 * Extract the title from the doc page file's config
 *
 * @param filePath The location of the file. Both the filename and the
 * contents of the file will be used to extract title from the config in the file
 */
export async function extractTitleFromDocPageFile(filePath: string) {
  const rawTS = (await fs.readFile('./' + filePath)).toString();

  const ast = tsquery.ast(rawTS);

  const defaultExportClassDeclaration = tsquery(
    ast,
    'ClassDeclaration:has(ExportKeyword):has(DefaultKeyword)'
  ).at(0);

  if (defaultExportClassDeclaration) {
    // generate title dynamically
    // TODO: Add folder structure to title generated here
    //       Should be based off whatever glob picked up this file
    return generateTitleFromFilePath(filePath);
  } else {
    // Find ExportAssignment in the TS file
    const exportAssignment = tsquery(ast, 'ExportAssignment').at(0);

    if (exportAssignment) {
      // There are two paths on this front
      // Either there is an in-line ObjectLiteral
      // Or there is an identifier that points to a VariableDeclaration
      // with the ObjectLiteral

      let objectLiteralExpression = tsquery(
        exportAssignment,
        'ObjectLiteralExpression'
      ).at(0);

      if (!objectLiteralExpression) {
        const identifier = tsquery(exportAssignment, 'Identifier').at(0);
        objectLiteralExpression = tsquery(
          ast,
          `VariableDeclaration:has(Identifier[name="${identifier?.getText(
            ast
          )}"]) > ObjectLiteralExpression`
        ).at(0);
      }

      if (objectLiteralExpression) {
        // Once the ObjectLiteral is found
        // Find the `title` property's string value

        const title = tsquery(
          objectLiteralExpression,
          'PropertyAssignment:has(Identifier[name="title"]) > StringLiteral'
        )
          .at(0)
          ?.getText(ast);

        if (title) {
          // For some reason `.getText()` returns the quotes of the string
          return title.replaceAll("'", '');
        } else {
          throw new Error(
            `No property found for 'title' in exported object literal for file: ${filePath}`
          );
        }
      } else {
        throw new Error(`No object literal export found for file: ${filePath}`);
      }
    } else {
      throw new Error(`No exports found for file: ${filePath}`);
    }
  }
}

/**
 * Generate the doc page config from the filePath and the title.
 *
 * @param filePath The original filePath (with '.ts')
 * @param title The title for the file
 */
export function generateDocPageConfig(filePath: string, title: string) {
  // Figure out variables for config list file output
  const filePathWithoutExtension = filePath.replace('.ts', '');
  const route = title.toLowerCase().replace(/[ /]/g, '-');
  return `
    '${route}': {
      mode: 'lazy',
      title: '${title}',
      loadConfig: () => import('../../../../${filePathWithoutExtension}').then((file) => file.default)
    }
`;
}

/**
 * Prettier formats any file content string passed in
 *
 * @param content The file content to be prettified
 */
export function formatContent(content: string): string {
  return prettier.format(content, {
    parser: 'typescript',
    printWidth: 100,
    singleQuote: true,
  });
}

/**
 * Generate the text of formatted TypeScript file around the config strings.
 *
 * @param configStrings The config strings generated from our path files
 */
export function wrapTypescriptBoilerplate(configStrings: string[]) {
  return `
  import { LazyDocConfigRecord, CompilerMode } from '@cdp/component-document-portal/util-types';

  export const docPageConfigs = {
    ${configStrings.toString()}
  } as LazyDocConfigRecord;
  export const compilerMode:CompilerMode = 'lazy';
`;
}

export function timeNow() {
  return format(new Date(), 'HH:mm:ss:SSS');
}
