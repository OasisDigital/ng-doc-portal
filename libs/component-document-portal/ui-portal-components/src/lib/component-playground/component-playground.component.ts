import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Input,
  Type,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '@incrudable/forms';
import { Subject, takeUntil } from 'rxjs';

import { ComponentPlaygroundConfig } from '../types';

@Component({
  selector: 'cdp-playground',
  templateUrl: './component-playground.component.html',
  styleUrls: ['./component-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentPlaygroundComponent {
  component: Type<any> | undefined;
  inputsControls: Control[] = [];
  formGroup = new FormGroup({});
  destroyFormValueChanges = new Subject<void>();

  @Input() set config(value: ComponentPlaygroundConfig) {
    this.destroyFormValueChanges.next();
    this.inputsControls = value.inputs;
    this.component = value.component;
  }

  setupComponentInputValueChanges(ref: ComponentRef<any>) {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyFormValueChanges))
      .subscribe((formValue) => {
        for (const [key, value] of Object.entries(formValue)) {
          ref.instance[key] = value;
        }
      });
  }
}
