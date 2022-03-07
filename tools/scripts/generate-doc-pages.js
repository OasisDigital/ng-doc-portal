const { existsSync } = require('fs');
const fs = require('fs/promises');
const { v1: uniqueId } = require('uuid');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const yargOptions = yargs(hideBin(process.argv)).argv;

const amountOfFiles = process.env.amount ?? yargOptions.amount ?? 100;

const directoryLocation =
  './apps/component-document-portal/src/app/generated-pages';

(async () => {
  if (existsSync(directoryLocation)) {
    await fs.rm(directoryLocation, { recursive: true, force: true });
  }
  await fs.mkdir(directoryLocation);

  for (let i = 1; i <= amountOfFiles; i++) {
    const docPageId = uniqueId();
    const docPageContent = `
  import { Component, NgModule } from '@angular/core';

  import { DocPageConfig } from '@cdp/component-document-portal/util-types';

  @Component({
    template: \`
      <h1>${docPageId} Component Document Page</h1>
      <span>${docPageId}</span>
    \`,
  })
  export class DocumentPageComponent {}

  // This can probably go away when Optional Modules is in Angular
  @NgModule({
    declarations: [],
    imports: [],
    providers: [],
  })
  class DocumentPageModule {}

  const docPageConfig: DocPageConfig = {
    title: 'Generated/${docPageId}',
    docPageComponent: DocumentPageComponent,
    ngModule: DocumentPageModule,
  };

  export default docPageConfig;

    `;

    await fs.writeFile(
      `${directoryLocation}/${docPageId}.doc-page.ts`,
      docPageContent
    );
  }
})();
