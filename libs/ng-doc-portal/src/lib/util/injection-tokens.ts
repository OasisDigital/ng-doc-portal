import { InjectionToken } from '@angular/core';

import { DocPageLoaderRecord } from '../types/doc-page-config.types';

export const DOC_PAGE_LOADERS_TOKEN = new InjectionToken<DocPageLoaderRecord>(
  'DOC_PAGE_LOADERS_TOKEN'
);
