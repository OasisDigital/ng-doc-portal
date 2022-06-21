import { ServeExecutorSchema } from './schema';

export default async function runExecutor(options: ServeExecutorSchema) {
  console.log('Executor ran for Serve', options);

  // run compiler once

  // then run `ng serve` & `compiler watch` in parallel

  return {
    success: true,
  };
}
