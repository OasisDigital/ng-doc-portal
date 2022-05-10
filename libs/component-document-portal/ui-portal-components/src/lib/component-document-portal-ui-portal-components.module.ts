import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';

import { CodeRevealComponent } from './code-reveal/code-reveal.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { RouterModule } from '@angular/router';
import { MarkdownComponent } from './markdown/markdown.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HighlightModule, CommonModule, RouterModule, HttpClientModule],
  declarations: [
    TabMenuComponent,
    CodeRevealComponent,
    TabItemComponent,
    SideNavComponent,
    MarkdownComponent,
  ],
  exports: [
    TabMenuComponent,
    CodeRevealComponent,
    TabItemComponent,
    SideNavComponent,
    MarkdownComponent,
  ],
})
export class DocComponentsModule {}
