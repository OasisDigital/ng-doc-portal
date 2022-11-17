import { Component } from '@angular/core';

import { DocPageConfigService } from '../../services/doc-page-config.service';

@Component({
  selector: 'ngdp-feature',
  templateUrl: './component-doc-portal-feature.component.html',
})
export class ComponentDocumentPortalFeatureComponent {
  filteredConfig: any;
  constructor(public configService: DocPageConfigService) {
    this.filteredConfig = { ...configService.configs };
  }

  filterConfig(event: any) {
    this.filteredConfig = this.configService.filterConfigs(event.target.value);
  }
}
