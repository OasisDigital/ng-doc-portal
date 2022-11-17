import { ExecutorContext, runExecutor } from '@nrwl/devkit';

import {
  getAngularConfigTarget,
  getConfigFileLocationFromContext,
  getDocPageLoadersFileLocationFromContext,
} from '../../util/context';
import { DocPageLoadersCompiler } from '../compiler/doc-page-loaders-compiler';

import { BuildExecutorSchema } from './schema';

export default async function buildExecutor(
  options: BuildExecutorSchema,
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
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  const configuration = getAngularConfigTarget(options, context);

  // run ng build
  const result = await runExecutor(
    { project: context.projectName ?? '', target: 'ng-build', configuration },
    {},
    context
  );

  for await (const res of result) {
    if (!res.success) return res;
  }

  return { success: true };
}
