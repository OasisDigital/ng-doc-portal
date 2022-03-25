import { existsSync } from 'fs';

import fs from 'fs/promises';
import { v1 as uniqueId } from 'uuid';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const yargOptions = yargs(hideBin(process.argv)).argv;

const amountOfFiles = Number(process.env.amount ?? yargOptions.amount ?? 100);

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
  import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';

  @Component({
    template: \`
      <cdp-tab-menu>
        <cdp-tab-item title="Overview">
          <h1>${docPageId} Component Document Page</h1>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at felis posuere mauris lobortis porta nec eu nisl. Pellentesque malesuada nisi sed arcu maximus, eu congue mi vulputate. Praesent justo arcu, convallis ac diam at, placerat gravida mauris. Vestibulum sit amet velit massa. Nam ut enim et dui dapibus varius dignissim vitae libero. Phasellus eget leo non risus volutpat ullamcorper eget in nibh. Quisque accumsan dolor vel odio feugiat, nec congue diam vehicula. Mauris mattis quis dolor quis varius. Cras erat ante, rhoncus non sem id, tincidunt hendrerit orci. Pellentesque sagittis semper tortor at convallis. Sed venenatis id mi eu placerat. Aliquam vel leo sed ligula porttitor facilisis. Curabitur eu gravida nibh. Vivamus mi nunc, semper eget nibh blandit, consectetur facilisis risus. Fusce aliquam pellentesque massa, non eleifend odio finibus quis.

          Integer volutpat erat nec augue tempus hendrerit. Donec dictum orci a scelerisque varius. Nam rutrum felis a lacus sollicitudin, sed egestas eros fringilla. Ut vel neque tempor, dapibus ante id, sodales quam. Aliquam pharetra scelerisque lectus, quis lacinia augue ornare pretium. Sed nec commodo lectus. Sed ac fermentum turpis, nec vehicula libero. Integer mollis pharetra mauris vel fringilla. Phasellus suscipit eros eu nunc dapibus ornare. Nam sed laoreet ipsum.

          In at purus condimentum, egestas ipsum vel, sagittis est. Etiam sed orci rhoncus mi lobortis imperdiet id gravida neque. Sed at sollicitudin lorem, non cursus metus. Suspendisse potenti. Ut porta nunc id justo fermentum fermentum. Praesent nec diam rhoncus, pretium leo et, consectetur risus. Curabitur ac lorem ullamcorper, fermentum leo eget, mattis ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc suscipit eu nisl a eleifend. Proin vulputate nibh nec nisi tempus, quis aliquet tellus facilisis. Morbi tempor dolor ut dignissim maximus. Nullam tristique tincidunt eros in eleifend.</p>
        </cdp-tab-item>
        <cdp-tab-item title="Examples">
          <button>Example ${docPageId}</button>
          <cdp-code-reveal lang="html">
            <button>Example ${docPageId}</button>
          </cdp-code-reveal>
        </cdp-tab-item>
      </cdp-tab-menu>
    \`,
  })
  export class DocumentPageComponent {}

  // This can probably go away when Optional Modules is in Angular
  @NgModule({
    declarations: [DocumentPageComponent],
    imports: [DocComponentsModule],
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