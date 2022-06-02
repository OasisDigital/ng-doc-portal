import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  Type,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { startWith, Subject, takeUntil } from 'rxjs';

import {
  ComponentPlaygroundConfig,
  PlaygroundControlConfig,
  PlaygroundControlConfigType,
} from './playground-types';
import { PlaygroundControlTemplateTypeGuards } from './template-type-guards';

interface PlaygroundControl {
  formControl: FormControl;
  config: PlaygroundControlConfig;
}

@Component({
  selector: 'cdp-playground',
  templateUrl: './component-playground.component.html',
  styleUrls: ['./component-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentPlaygroundComponent implements OnDestroy {
  component: Type<any> | undefined;
  playgroundControls: PlaygroundControl[] = [];
  formGroup = new FormGroup({});
  destroyControlsValueChanges = new Subject<void>();

  TypeGuards = PlaygroundControlTemplateTypeGuards;

  ControlTypes = PlaygroundControlConfigType;

  @Input() set config(value: ComponentPlaygroundConfig) {
    this.destroyControlsValueChanges.next();
    this.component = value.component;
    this.playgroundControls = value.inputs.map((config) => ({
      config,
      formControl: new FormControl(config.value),
    }));
  }

  setupComponentInputValueChanges(ref: ComponentRef<any>) {
    // syncs form controls to inputs
    for (const playgroundControl of this.playgroundControls) {
      playgroundControl.formControl.valueChanges
        .pipe(
          startWith(playgroundControl.formControl.value),
          takeUntil(this.destroyControlsValueChanges)
        )
        .subscribe((newValue) => {
          ref.instance[playgroundControl.config.property] = newValue;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyControlsValueChanges.next();
    this.destroyControlsValueChanges.complete();
  }
}
