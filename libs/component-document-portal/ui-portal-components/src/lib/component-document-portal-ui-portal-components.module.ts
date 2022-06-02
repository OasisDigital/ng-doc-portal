import { EmbedIframeComponent } from './embed-iframe/embed-iframe.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

import { CodeRevealComponent } from './code-reveal/code-reveal.component';
import { ComponentPlaygroundModule } from './component-playground/component-playground.module';
import { MarkdownComponent } from './markdown/markdown.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';

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
    EmbedIframeComponent,
  ],
  exports: [
    TabMenuComponent,
    CodeRevealComponent,
    TabItemComponent,
    SideNavComponent,
    MarkdownComponent,
    EmbedIframeComponent,
    ComponentPlaygroundModule,
  ],
})
export class DocComponentsModule {}
