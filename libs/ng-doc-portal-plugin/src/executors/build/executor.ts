import { BuildExecutorSchema } from './schema';

export default async function runExecutor(options: BuildExecutorSchema) {
  console.log('Executor ran for Build', options);

  // run doc config compiler once

  // run ng build

  return {
    success: true,
  };
}
