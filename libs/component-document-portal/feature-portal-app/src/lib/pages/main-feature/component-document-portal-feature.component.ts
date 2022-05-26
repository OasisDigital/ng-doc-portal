import { Component } from '@angular/core';

import { DocPageConfigService } from '../../services/doc-page-config.service';

@Component({
  selector: 'cdp-feature',
  templateUrl: './component-document-portal-feature.component.html',
  styleUrls: ['./component-document-portal-feature.component.scss'],
})
export class ComponentDocumentPortalFeatureComponent {
  constructor(public configService: DocPageConfigService) {}
}
