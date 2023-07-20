import { ExecutorContext } from '@nx/devkit';

import {
  getConfigFileLocationFromContext,
  getDocPageLoadersFileLocationFromContext,
} from '../../util/context';
import { DocPageLoadersCompiler } from '../compiler/doc-page-loaders-compiler';

import { CompileExecutorSchema } from './schema';

export default async function runExecutor(
  options: CompileExecutorSchema,
  context: ExecutorContext
) {
  // create compiler
  const configLocation = getConfigFileLocationFromContext(options, context);
  const docPageLoadersFileLocation = getDocPageLoadersFileLocationFromContext(
    options,
    context
  );

  const compiler = new DocPageLoadersCompiler(
    configLocation,
    docPageLoadersFileLocation
  );

  // run doc config compiler once
  try {
    await compiler.runOnce();
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
