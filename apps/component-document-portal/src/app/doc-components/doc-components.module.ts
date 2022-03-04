import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

import { CodeRevealComponent } from './code-reveal/code-reveal.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';

@NgModule({
  imports: [HighlightModule, CommonModule, RouterModule],
  declarations: [TabMenuComponent, CodeRevealComponent],
  exports: [TabMenuComponent, CodeRevealComponent],
})
export class DocComponentsModule {}
