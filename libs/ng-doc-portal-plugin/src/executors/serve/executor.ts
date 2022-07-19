import { ExecutorContext, runExecutor } from '@nrwl/devkit';

import { getConfigFileLocationFromContext } from '../../util/context';
import { DocPageConfigsCompiler } from '../compiler/doc-page-configs-compiler';

import { ServeExecutorSchema } from './schema';

function isAsyncIterator<T extends { success: boolean }>(
  v: { success: boolean } | AsyncIterableIterator<T>
): v is AsyncIterableIterator<T> {
  return typeof (v as any)?.[Symbol.asyncIterator] === 'function';
}

export default async function runServe(
  _options: ServeExecutorSchema,
  context: ExecutorContext
) {
  // create compiler
  const configLocation = getConfigFileLocationFromContext(context);

  const compiler = new DocPageConfigsCompiler('lazy', configLocation);

  // run compiler once
  try {
    await compiler.runOnce();
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  // then run `ng serve`
  const result = await Promise.race(
    // Add compiler watch here when ready
    [
      runExecutor(
        { project: context.projectName ?? '', target: 'serve' },
        { watch: true },
        context
      ),
      compiler.watch(),
    ]
  );

  if (isAsyncIterator(result)) {
    for await (const res of result) {
      if (!res.success) return res;
    }
    return { success: true };
  } else {
    return result;
  }
}
