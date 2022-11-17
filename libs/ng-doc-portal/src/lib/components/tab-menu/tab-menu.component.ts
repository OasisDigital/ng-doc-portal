import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

import { TabItemComponent } from '../tab-item/tab-item.component';

@Component({
  selector: 'ngdp-tab-menu',
  templateUrl: './tab-menu.component.html',
})
export class TabMenuComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(TabItemComponent) tabMenuItems: QueryList<TabItemComponent> =
    new QueryList<TabItemComponent>();

  tabs: TabItemComponent[] = [];
  activeTab: TabItemComponent | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.route.queryParamMap
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params.get('tab'))
      )
      .subscribe((tabName) => {
        this.selectTab(tabName);
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(tabName: string | null) {
    this.tabs = this.tabMenuItems.toArray();

    if (!tabName) {
      tabName = this.tabs[0].title;
    }

    const title = decodeURIComponent(tabName);
    const tab = this.tabs.find((t) => t.title === title);

    this.activeTab = tab ?? this.tabs[0];
  }

  goToTab(tabItem: TabItemComponent) {
    // Format as kebab-case for query param
    const tab = encodeURIComponent(tabItem.title);

    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { tab },
    });
  }
}
