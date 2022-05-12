import { Component, Input } from '@angular/core';
import { SelectRuntimeControl } from '@incrudable/forms';

@Component({
  selector: 'cdp-select-control',
  styleUrls: ['./control.scss'],
  template: `
    <ng-container *ngIf="control">
      <label [for]="control.propertyName">{{ control.label }}:</label>
      <select
        [id]="control.propertyName"
        [formControl]="$any(control.formControl)"
      >
        <option
          *ngFor="let option of control.typeOptions?.options"
          [value]="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </ng-container>
  `,
})
export class SelectControlComponent {
  @Input() control?: SelectRuntimeControl;
}
