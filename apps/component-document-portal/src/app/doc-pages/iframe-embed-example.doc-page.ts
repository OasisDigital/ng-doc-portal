import { Component } from '@angular/core';

import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';
import { DocPageConfig } from '@cdp/component-document-portal/util-types';

@Component({
  standalone: true,
  imports: [DocComponentsModule],
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

const docPageConfig: DocPageConfig = {
  title: 'General/Iframe Embed Example',
  docPageComponent: IframeEmbedExampleComponent,
};

export default docPageConfig;
