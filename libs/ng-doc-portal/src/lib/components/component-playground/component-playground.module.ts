import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentPlaygroundComponent } from './component-playground.component';
import { RenderComponentDirective } from './render-component.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [ComponentPlaygroundComponent, RenderComponentDirective],
  exports: [ComponentPlaygroundComponent],
})
export class ComponentPlaygroundModule {}
