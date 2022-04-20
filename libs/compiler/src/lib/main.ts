import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { CompilerMode } from '@cdp/component-document-portal/util-types';

import { DocPageConfigsCompiler } from './doc-page-configs-compiler';

const yargOptions = yargs(hideBin(process.argv)).argv;

const shouldWatch = Boolean(process.env.watch ?? yargOptions.watch ?? false);
const silenced = Boolean(process.env.silent ?? yargOptions.silent ?? false);
const mode = process.env.mode ?? yargOptions.mode ?? 'lazy';

if (mode !== 'lazy' && mode !== 'runtime') {
  throw new Error("Mode is incorrect it should be either 'runtime' or 'lazy'");
}

new DocPageConfigsCompiler(
  mode as CompilerMode,
  shouldWatch,
  silenced
).compile();
