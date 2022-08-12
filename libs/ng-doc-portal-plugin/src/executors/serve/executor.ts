import { ExecutorContext, runExecutor } from '@nrwl/devkit';
import { firstValueFrom, shareReplay, switchMap } from 'rxjs';

import {
  getConfigFileLocationFromContext,
  getDocPageConfigsFileLocationFromContext,
} from '../../util/context';
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
  const docPageConfigsFileLocation =
    getDocPageConfigsFileLocationFromContext(context);

  const compiler = new DocPageConfigsCompiler(
    'lazy',
    configLocation,
    docPageConfigsFileLocation
  );

  const compilerWatch = compiler.watch().pipe(shareReplay(1));

  // Run angular serve executor after first initial event from compiler watcher
  const angularServeExecutor = firstValueFrom(
    compilerWatch.pipe(
      switchMap(() =>
        runExecutor(
          { project: context.projectName ?? '', target: 'serve' },
          { watch: true },
          context
        )
      )
    )
  );

  // convert the compiler watch ending events to executor resolutions
  const compilerWatchPromise = new Promise<{ success: boolean }>((resolve) => {
    compilerWatch.subscribe({
      error: () => resolve({ success: false }),
      complete: () => resolve({ success: true }),
    });
  });

  const result = await Promise.race([
    angularServeExecutor,
    compilerWatchPromise,
  ]);

  // Check to see if the angular serve finished or the compiler watcher
  if (isAsyncIterator(result)) {
    for await (const res of result) {
      if (!res.success) return res;
    }
    return { success: true };
  } else {
    return result;
  }
}
