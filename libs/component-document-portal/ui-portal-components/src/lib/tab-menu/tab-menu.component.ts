import {
  AfterContentInit,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { TabItemComponent } from '../tab-item/tab-item.component';

@Component({
  selector: 'cdp-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
})
export class TabMenuComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(TabItemComponent) tabMenuItems: QueryList<TabItemComponent> = new QueryList<TabItemComponent>();

  tabs: TabItemComponent[] = [];
  activeTab: TabItemComponent | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngAfterContentInit() {
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$),
      map(params => params.get('tab')),
    ).subscribe((tabName) => this.selectTab(tabName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(tabName: string | null) {
    this.tabs = this.tabMenuItems.toArray();

    if (!tabName) {
      this.goToTab(this.tabs[0]);
      return;
    }

    // Revert kebab-case formatting from `this.selectTab`
    const title = tabName.replace('-', ' ');
    const tab = this.tabs.find(t => t.title.toLowerCase() === title);

    this.activeTab = tab ?? this.tabs[0];
  }

  goToTab(tabItem: TabItemComponent) {
    // Format as kebab-case for query param
    const tab = tabItem.title.toLowerCase().replace(' ', '-');

    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { tab },
    });
  }
}
