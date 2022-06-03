import { Component, NgModule } from '@angular/core';

import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';
import { DocPageConfig } from '@cdp/component-document-portal/util-types';

@Component({
  template: `
    <cdp-tab-menu>
      <cdp-tab-item title="Overview">
        <h1>Iframe Embed Example!</h1>
        <p>Just provide a url to the "src" input</p>
      </cdp-tab-item>
      <cdp-tab-item title="Embed">
        <cdp-embed-iframe
          src="https://www.youtube.com/embed/gSvxYv2VgHc"
        ></cdp-embed-iframe>
      </cdp-tab-item>
    </cdp-tab-menu>
  `,
})
export class IframeEmbedExampleComponent {}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [IframeEmbedExampleComponent],
  imports: [DocComponentsModule],
})
export class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'General/Iframe Embed Example',
  docPageComponent: IframeEmbedExampleComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
