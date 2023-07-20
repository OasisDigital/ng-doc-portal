import { ExecutorContext } from '@nx/devkit';

import executor from './executor';
import { CompileExecutorSchema } from './schema';

const options: CompileExecutorSchema = {
  configFile: 'apps/test-location',
};

const context: ExecutorContext = {} as any;

describe('Compile Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
