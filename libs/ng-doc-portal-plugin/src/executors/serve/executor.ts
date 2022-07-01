import { ExecutorContext, runExecutor } from '@nrwl/devkit';

import { ServeExecutorSchema } from './schema';

export default async function runServe(
  _options: ServeExecutorSchema,
  context: ExecutorContext
) {
  // run compiler once
  // Don't know how to do yet

  // then run `ng serve` & `compiler watch` in parallel
  const result = await Promise.race(
    // Add compiler watch here when ready
    [
      runExecutor(
        { project: context.projectName ?? '', target: 'serve' },
        { watch: true },
        context
      ),
    ]
  );

  for await (const res of result) {
    if (!res.success) return res;
  }

  return { success: true };
}
