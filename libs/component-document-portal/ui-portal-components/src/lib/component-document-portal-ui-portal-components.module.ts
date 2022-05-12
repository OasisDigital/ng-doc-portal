import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

import { CodeRevealComponent } from './code-reveal/code-reveal.component';
import { ComponentPlaygroundModule } from './component-playground/component-playground.module';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MarkdownComponent } from './markdown/markdown.component';

@NgModule({
  imports: [
    HighlightModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    ComponentPlaygroundModule,
  ],
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
    ComponentPlaygroundModule,
  ],
})
export class DocComponentsModule {}
