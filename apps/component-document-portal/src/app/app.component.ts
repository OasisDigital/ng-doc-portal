import { Component } from '@angular/core';
import { DocPageConfigService } from './doc-page-config.service';

@Component({
  selector: 'cdp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public configService: DocPageConfigService) {}
}
