import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlMapping, FormEngineModule } from '@incrudable/forms';

import { ComponentPlaygroundComponent } from './component-playground.component';
import { CheckBoxControlComponent } from './incrudable-renderer-components/checkbox-group-control.component';
import { DateControlComponent } from './incrudable-renderer-components/date-control.component';
import { InputControlComponent } from './incrudable-renderer-components/input-control.component';
import { RadioGroupControlComponent } from './incrudable-renderer-components/radio-group-control.component';
import { SelectControlComponent } from './incrudable-renderer-components/select-control.component';
import { TimeControlComponent } from './incrudable-renderer-components/time-control.component';
import { RenderComponentDirective } from './render-component.directive';

const controls: ControlMapping = {
  input: { control: InputControlComponent },
  select: { control: SelectControlComponent },
  date: { control: DateControlComponent },
  checkGroup: { control: CheckBoxControlComponent },
  radioGroup: { control: RadioGroupControlComponent },
  time: { control: TimeControlComponent },
};

@NgModule({
  imports: [
    CommonModule,
    FormEngineModule.forRoot(controls),
    ReactiveFormsModule,
  ],
  declarations: [
    ComponentPlaygroundComponent,
    RenderComponentDirective,
    InputControlComponent,
    SelectControlComponent,
    DateControlComponent,
    CheckBoxControlComponent,
    RadioGroupControlComponent,
    TimeControlComponent,
  ],
  exports: [ComponentPlaygroundComponent],
})
export class ComponentPlaygroundModule {}
