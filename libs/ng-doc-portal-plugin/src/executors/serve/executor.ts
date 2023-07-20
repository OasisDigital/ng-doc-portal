import { ExecutorContext, runExecutor } from '@nx/devkit';
import { firstValueFrom, shareReplay, switchMap } from 'rxjs';

import {
  getAngularConfigTarget,
  getConfigFileLocationFromContext,
  getDocPageLoadersFileLocationFromContext,
} from '../../util/context';
import { DocPageLoadersCompiler } from '../compiler/doc-page-loaders-compiler';

import { ServeExecutorSchema } from './schema';

export default async function runServe(
  options: ServeExecutorSchema,
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

  const compilerWatch = compiler.watch().pipe(shareReplay(1));

  // Run angular serve executor after first initial event from compiler watcher

  const configuration = getAngularConfigTarget(options, context);

  // We let this run and ignore it
  firstValueFrom(
    compilerWatch.pipe(
      switchMap(() =>
        runExecutor(
          {
            project: context.projectName ?? '',
            target: 'ng-serve',
            configuration,
          },
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

  return await compilerWatchPromise;
}
