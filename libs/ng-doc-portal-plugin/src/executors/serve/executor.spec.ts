import { ExecutorContext } from '@nrwl/devkit';

import executor from './executor';
import { ServeExecutorSchema } from './schema';

const options: ServeExecutorSchema = {
  configFile: 'apps/test-location',
};

const context: ExecutorContext = {} as any;

describe('Serve Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
