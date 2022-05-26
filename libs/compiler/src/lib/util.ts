import { format } from 'date-fns';
import path from 'path';
import ts from 'typescript';
import fs from 'fs/promises';
import prettier from 'prettier';

import { EventPayload, ProcessedFileEvent, RawFileEvent } from './types';

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

/**
 * Extract the title from the doc page file's config
 *
 * @param filePath The location of the file. Both the filename and the
 * contents of the file will be used to extract title from the config in the file
 */
export async function extractTitleFromDocPageFile(filePath: string) {
  const rawTS = (await fs.readFile('./' + filePath)).toString();

  // create a TS node source for our traversal
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    rawTS,
    ts.ScriptTarget.Latest
  );
  return exports.findTitle(sourceFile, filePath);
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
 * Find the title from the sourceFile, if possible. Throw an error if
 * it can't be found.
 *
 * @param sourceFile The sourceFile
 * @param filePath The file being examined (used for error logging)
 */
export function findTitle(sourceFile: ts.SourceFile, filePath: string) {
  // Find the starting point for the recursive traversal
  // This is hopefully an object that is being default exported or has the `DocPageConfig` type
  const statementWithTitle = exports.findStatementWithTitle(
    sourceFile.statements,
    sourceFile
  );

  if (!statementWithTitle) {
    throw new Error(`Could not find doc page config export from ${filePath}`);
  }

  // Recursively traverse the nodes from the starting point looking for a string literal
  const rawTitle = exports.recursivelyFindTitle(statementWithTitle, sourceFile);

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
export function findStatementWithTitle(
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
export function recursivelyFindTitle(
  node: ts.Node,
  sourceFile: ts.SourceFile
): string | null {
  const children = node.getChildren(sourceFile);
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const result = exports.recursivelyFindTitle(children[i], sourceFile);
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
