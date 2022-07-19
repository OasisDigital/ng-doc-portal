import { ExecutorContext, runExecutor } from '@nrwl/devkit';

import {
  getConfigFileLocationFromContext,
  getDocPageConfigsFileLocationFromContext,
} from '../../util/context';
import { DocPageConfigsCompiler } from '../compiler/doc-page-configs-compiler';

import { BuildExecutorSchema } from './schema';

export default async function buildExecutor(
  _options: BuildExecutorSchema,
  context: ExecutorContext
) {
  // create compiler
  const configLocation = getConfigFileLocationFromContext(context);
  const docPageConfigsFileLocation =
    getDocPageConfigsFileLocationFromContext(context);

  const compiler = new DocPageConfigsCompiler(
    'lazy',
    configLocation,
    docPageConfigsFileLocation
  );

  // run doc config compiler once
  try {
    await compiler.runOnce();
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  // run ng build
  const result = await runExecutor(
    { project: context.projectName ?? '', target: 'build' },
    {},
    context
  );

  for await (const res of result) {
    if (!res.success) return res;
  }

  return { success: true };
}
