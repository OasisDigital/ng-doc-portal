import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';

import { CodeRevealComponent } from './code-reveal/code-reveal.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { TabItemComponent } from './tab-item/tab-item.component';

@NgModule({
  imports: [HighlightModule, CommonModule],
  declarations: [TabMenuComponent, CodeRevealComponent, TabItemComponent],
  exports: [TabMenuComponent, CodeRevealComponent, TabItemComponent],
})
export class DocComponentsModule {}
