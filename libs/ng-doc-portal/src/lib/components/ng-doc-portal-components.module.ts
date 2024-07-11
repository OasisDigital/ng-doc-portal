import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

import { CodeSnippetComponent } from './code-snippet/code-snippet.component';
import { CodeSnippetDirective } from './code-snippet/code-snippet.directive';
import { ComponentPlaygroundComponent } from './component-playground/component-playground.component';
import { EmbedIframeComponent } from './embed-iframe/embed-iframe.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { MarkdownDirective } from './markdown/markdown.directive';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { TitleComponent } from './title/title.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  exports: [
    TabMenuComponent,
    TabItemComponent,
    CodeSnippetComponent,
    SideNavComponent,
    MarkdownComponent,
    MarkdownDirective,
    EmbedIframeComponent,
    ToolbarComponent,
    TitleComponent,
    CodeSnippetDirective,
    ComponentPlaygroundComponent,
  ],
  imports: [
    HighlightModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TabMenuComponent,
    TabItemComponent,
    CodeSnippetComponent,
    SideNavComponent,
    MarkdownComponent,
    MarkdownDirective,
    EmbedIframeComponent,
    ToolbarComponent,
    TitleComponent,
    CodeSnippetDirective,
    ComponentPlaygroundComponent,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class NgDocPortalComponentsModule {}
