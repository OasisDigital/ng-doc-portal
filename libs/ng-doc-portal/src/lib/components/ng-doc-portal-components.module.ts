import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

import { CodeRevealComponent } from './code-reveal/code-reveal.component';
import { ComponentPlaygroundModule } from './component-playground/component-playground.module';
import { EmbedIframeComponent } from './embed-iframe/embed-iframe.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [
    HighlightModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    ComponentPlaygroundModule,
    ReactiveFormsModule,
  ],
  declarations: [
    TabMenuComponent,
    TabItemComponent,
    CodeRevealComponent,
    SideNavComponent,
    MarkdownComponent,
    EmbedIframeComponent,
    ToolbarComponent,
  ],
  exports: [
    TabMenuComponent,
    TabItemComponent,
    CodeRevealComponent,
    SideNavComponent,
    MarkdownComponent,
    EmbedIframeComponent,
    ToolbarComponent,
    ComponentPlaygroundModule,
  ],
})
export class NgDocPortalComponentsModule {}
