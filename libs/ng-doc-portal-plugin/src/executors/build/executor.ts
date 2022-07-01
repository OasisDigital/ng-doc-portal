import { ExecutorContext, runExecutor } from '@nrwl/devkit';

import { BuildExecutorSchema } from './schema';

export default async function buildExecutor(
  _options: BuildExecutorSchema,
  context: ExecutorContext
) {
  // run doc config compiler once
  // No idea how to do this yet...

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
