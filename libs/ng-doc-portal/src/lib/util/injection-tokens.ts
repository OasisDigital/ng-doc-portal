import { InjectionToken } from '@angular/core';

import {
  CompilerMode,
  LazyDocConfigRecord,
  RuntimeDocConfigArray,
} from '../types/doc-page-config.types';

export const DOC_PAGE_CONFIG_TOKEN = new InjectionToken<
  RuntimeDocConfigArray | LazyDocConfigRecord
>('DOC_PAGE_CONFIG_TOKEN');

export const COMPILER_MODE_TOKEN = new InjectionToken<CompilerMode>(
  'COMPILER_MODE'
);
