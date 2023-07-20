import { ExecutorContext } from '@nx/devkit';

import executor from './executor';
import { BuildExecutorSchema } from './schema';

const options: BuildExecutorSchema = {
  configFile: 'apps/test-location',
};

const context: ExecutorContext = {} as any;

describe('Build Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
