import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { DocPageConfigsCompiler } from './doc-page-configs-compiler';

const yargOptions = yargs(hideBin(process.argv)).argv;

const shouldWatch = Boolean(process.env.watch ?? yargOptions.watch ?? false);
const silenced = Boolean(process.env.silent ?? yargOptions.silent ?? false);

new DocPageConfigsCompiler(shouldWatch, silenced).compile();
