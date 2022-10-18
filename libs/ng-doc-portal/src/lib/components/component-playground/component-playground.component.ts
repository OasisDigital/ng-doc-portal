import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Inject } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { startWith, Subject, takeUntil } from 'rxjs';

import {
  ComponentPlaygroundConfig,
  PlaygroundClassBindingControlConfig,
  PlaygroundControlConfig,
  PlaygroundControlConfigType,
  PlaygroundTextContentControlConfig,
} from './playground-types';
import { RenderComponentConfig } from './render-component.directive';
import { PlaygroundControlTemplateTypeGuards } from './template-type-guards';

interface PlaygroundControl {
  formControl: UntypedFormControl;
  config: PlaygroundControlConfig;
}

@Component({
  selector: 'cdp-playground',
  templateUrl: './component-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentPlaygroundComponent implements OnDestroy {
  renderComponentConfig?: RenderComponentConfig;
  playgroundControls: PlaygroundControl[] = [];
  classBinding?: string | string[] | PlaygroundClassBindingControlConfig;
  classBindingControl?: FormControl;
  classBindingControlConfig?: PlaygroundClassBindingControlConfig;
  formGroup = new UntypedFormGroup({});
  textContentControl?: FormControl;
  destroyControlsValueChanges = new Subject<void>();
  destroyClassBindingValueChanges = new Subject<void>();
  destroyTextContentValueChanges = new Subject<void>();

  clamp = Math.min;

  TypeGuards = PlaygroundControlTemplateTypeGuards;
  ControlTypes = PlaygroundControlConfigType;

  @Input() set config(config: ComponentPlaygroundConfig) {
    this.destroyControlsValueChanges.next();
    this.renderComponentConfig = {
      component: config.component,
      projectableNodes: this.createProjectableNodes(config.textContentBinding),
    };
    this.playgroundControls =
      config.inputs?.map((controlConfig) => ({
        config: controlConfig,
        formControl: new UntypedFormControl(controlConfig.value),
      })) ?? [];
    this.classBinding = config.classBinding;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef
  ) {}

  createProjectableNodes(
    projectable?: string | Node[][] | true | PlaygroundTextContentControlConfig
  ): Node[][] | undefined {
    if (projectable) {
      if (typeof projectable === 'string') {
        const textNode = this.document.createTextNode(projectable);
        return [[textNode]];
      } else if (Array.isArray(projectable)) {
        return projectable;
      } else {
        let defaultText = '';
        if (typeof projectable !== 'boolean') {
          defaultText = projectable.default ?? '';
        }
        this.destroyTextContentValueChanges.next();
        this.textContentControl = new FormControl(defaultText);
        const textNode = this.document.createTextNode(defaultText);
        this.textContentControl.valueChanges
          .pipe(takeUntil(this.destroyTextContentValueChanges))
          .subscribe((text) => (textNode.textContent = text));
        return [[textNode]];
      }
    } else {
      return undefined;
    }
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

  setupComponentClassBindings(ref: ComponentRef<any>) {
    if (this.classBinding) {
      const element = ref.location.nativeElement as HTMLElement;
      if (typeof this.classBinding === 'string') {
        const classes = this.classBinding.split(' ');
        classes.forEach((c) => {
          element.classList.add(c);
        });
      } else if (Array.isArray(this.classBinding)) {
        this.classBinding.forEach((c) => {
          element.classList.add(c);
        });
      } else {
        this.classBindingControl = new FormControl(
          this.classBinding.default ?? ''
        );
        this.classBindingControlConfig = this.classBinding;
        this.destroyClassBindingValueChanges.next();
        this.classBindingControl.valueChanges
          .pipe(takeUntil(this.destroyClassBindingValueChanges))
          .subscribe((classes: string[]) => {
            this.classBindingControlConfig?.classes.forEach((c) => {
              if (classes.includes(c)) {
                element.classList.add(c);
              } else {
                element.classList.remove(c);
              }
            });
          });
      }
    }
  }

  initializeComponentBindings(ref: ComponentRef<any>) {
    this.setupComponentInputValueChanges(ref);
    this.setupComponentClassBindings(ref);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroyControlsValueChanges.next();
    this.destroyControlsValueChanges.complete();
    this.destroyClassBindingValueChanges.next();
    this.destroyClassBindingValueChanges.complete();
    this.destroyTextContentValueChanges.next();
    this.destroyTextContentValueChanges.complete();
  }
}
