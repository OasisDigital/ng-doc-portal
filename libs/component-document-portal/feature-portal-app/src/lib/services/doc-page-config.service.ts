import { Inject, Injectable } from '@angular/core';

import {
  CompilerMode,
  DocConfigRecord,
  LazyDocConfigRecord,
  RuntimeDocConfigArray,
} from '@cdp/component-document-portal/util-types';

import {
  COMPILER_MODE_TOKEN,
  DOC_PAGE_CONFIG_TOKEN,
} from '../util/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class DocPageConfigService {
  configs: DocConfigRecord = {};
  loading = true;

  constructor(
    @Inject(COMPILER_MODE_TOKEN) private compilerMode: CompilerMode,
    @Inject(DOC_PAGE_CONFIG_TOKEN)
    private docPageConfigs: LazyDocConfigRecord | RuntimeDocConfigArray
  ) {
    this.init();
  }

  async init() {
    if (this.compilerMode === 'lazy') {
      this.configs = this.docPageConfigs as DocConfigRecord;
      this.loading = false;
    } else {
      this.configs = await importRuntimeDocConfigs(
        this.docPageConfigs as RuntimeDocConfigArray
      );
      // Just so we can see the loading message for now :)
      setTimeout(() => (this.loading = false), 1000);
    }
  }

  filterConfigs(filter: string) {
    const filtered = Object.assign(
      {},
      ...Object.entries(this.configs)
        .filter(([k]) => k.includes(filter))
        .map(([k, v]) => ({ [k]: v }))
    );
    return filtered;
  }
}

async function importRuntimeDocConfigs(runtimeConfigs: RuntimeDocConfigArray) {
  const configs = {} as DocConfigRecord;
  for (const loadConfig of runtimeConfigs) {
    const config = await loadConfig();
    let route = config.title.toLowerCase().replace(/[ /]/g, '-');
    let title = config.title;
    let titleCountAddition = 1;
    while (configs[route]) {
      titleCountAddition++;
      title = `${config.title} ${titleCountAddition}`;
      route = title.toLowerCase().replace(/[ /]/g, '-');
    }
    if (titleCountAddition > 1) {
      console.warn(
        `DUPLICATE DOCUMENT PAGE TITLE DETECTED!\n"${config.title}" RENAMED TO "${title}"\n Please Resolve This Before Publishing!`
      );
    }
    configs[route] = {
      title: title,
      mode: 'runtime',
      config,
    };
  }
  return configs;
}
