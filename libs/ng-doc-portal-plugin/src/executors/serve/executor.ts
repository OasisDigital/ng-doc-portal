import { ExecutorContext, runExecutor } from '@nrwl/devkit';
import { firstValueFrom, shareReplay, switchMap } from 'rxjs';

import {
  getAngularConfigTarget,
  getConfigFileLocationFromContext,
  getDocPageConfigsFileLocationFromContext,
} from '../../util/context';
import { DocPageConfigsCompiler } from '../compiler/doc-page-configs-compiler';

import { ServeExecutorSchema } from './schema';

export default async function runServe(
  options: ServeExecutorSchema,
  context: ExecutorContext
) {
  // create compiler
  const configLocation = getConfigFileLocationFromContext(options, context);
  const docPageConfigsFileLocation = getDocPageConfigsFileLocationFromContext(
    options,
    context
  );

  const compiler = new DocPageConfigsCompiler(
    'lazy',
    configLocation,
    docPageConfigsFileLocation
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
