import { Component } from '@angular/core';
import {
  NgDocPortalComponentsModule,
  DocPageConfig,
} from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
  template: `
    <ngdp-tab-menu>
      <ngdp-tab-item title="Overview">
        <h1>Iframe Embed Example!</h1>
        <p>Just provide a url to the "src" input</p>
      </ngdp-tab-item>
      <ngdp-tab-item title="Embed">
        <ngdp-embed-iframe
          src="https://www.youtube.com/embed/gSvxYv2VgHc"
        ></ngdp-embed-iframe>
      </ngdp-tab-item>
    </ngdp-tab-menu>
  `,
})
export class IframeEmbedExampleComponent {}

const docPageConfig: DocPageConfig = {
  title: 'General/Iframe Embed Example',
  component: IframeEmbedExampleComponent,
};

export default docPageConfig;
