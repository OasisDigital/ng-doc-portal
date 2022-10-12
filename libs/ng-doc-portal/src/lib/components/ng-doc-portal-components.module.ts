import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

import { CodeSnippetComponent } from './code-snippet/code-snippet.component';
import { CodeSnippetDirective } from './code-snippet/code-snippet.directive';
import { ComponentPlaygroundModule } from './component-playground/component-playground.module';
import { EmbedIframeComponent } from './embed-iframe/embed-iframe.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { TitleComponent } from './title/title.component';
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
    CodeSnippetComponent,
    SideNavComponent,
    MarkdownComponent,
    EmbedIframeComponent,
    ToolbarComponent,
    TitleComponent,
    CodeSnippetDirective,
  ],
  exports: [
    TabMenuComponent,
    TabItemComponent,
    CodeSnippetComponent,
    SideNavComponent,
    MarkdownComponent,
    EmbedIframeComponent,
    ToolbarComponent,
    ComponentPlaygroundModule,
    TitleComponent,
    CodeSnippetDirective,
  ],
})
export class NgDocPortalComponentsModule {}
