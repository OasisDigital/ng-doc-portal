import { Inject, Injectable } from '@angular/core';
import {
  CompilerMode,
  LazyDocConfigRecord,
  RuntimeDocConfigArray,
} from '@cdp/component-document-portal/util-types';
import { COMPILER_MODE_TOKEN, DOC_PAGE_CONFIG_TOKEN } from './app.module';
@Injectable({
  providedIn: 'root',
})
export class DocPageConfigService {
  configs: LazyDocConfigRecord = {};
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
      this.configs = this.docPageConfigs as LazyDocConfigRecord;
      this.loading = false;
    } else {
      this.configs = await importRuntimeDocConfigs(
        this.docPageConfigs as RuntimeDocConfigArray
      );
      // Just so we can see the loading message for now :)
      setTimeout(() => (this.loading = false), 1000);
    }
  }
}

async function importRuntimeDocConfigs(runtimeConfigs: RuntimeDocConfigArray) {
  const configs = {} as LazyDocConfigRecord;
  for (const loadConfig of runtimeConfigs) {
    const config = await loadConfig();
    const route = config.title.toLowerCase().replace(/[ /]/g, '-');
    configs[route] = {
      title: config.title,
      mode: 'runtime',
      config,
    };
  }
  return configs;
}
