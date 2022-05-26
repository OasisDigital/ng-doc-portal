import { Component, Input } from '@angular/core';
import { CheckGroupRuntimeControl } from '@incrudable/forms';

@Component({
  selector: 'cdp-input-control',
  template: `
    <ng-container *ngIf="control">
      <label>{{ control.label }}:</label>
      <span *ngFor="let option of control.typeOptions?.options">
        <label [for]="control.propertyName + '-' + option.value">
          {{ option.label }}
        </label>
        <input
          type="checkbox"
          [id]="control.propertyName + '-' + option.value"
          [formControl]="$any(control.formControl)"
          [value]="option.value"
        />
      </span>
    </ng-container>
  `,
})
export class CheckBoxControlComponent {
  @Input() control?: CheckGroupRuntimeControl;
}
