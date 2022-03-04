import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cdp-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
})
export class TabMenuComponent {
  @Input() headers = ['OVERVIEW', 'API', 'EXAMPLES'];
  selectedHeader = this.headers[0];
  searchParams = new URLSearchParams(window.location.search);

  constructor(private router: Router, private route: ActivatedRoute) {
    const param = this.searchParams.get('tab');
    if (param) {
      this.selectedHeader = param;
    } else {
      this.queryRoute(this.selectedHeader);
    }
  }

  tabSwitch(tab: string) {
    this.selectedHeader = tab;
    this.queryRoute(tab);
  }

  queryRoute(query: string) {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { tab: query },
    });
  }
}
