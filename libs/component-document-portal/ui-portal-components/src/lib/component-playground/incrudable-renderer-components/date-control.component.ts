import { Component, Input } from '@angular/core';
import { DateRunTimeControl } from '@incrudable/forms';

@Component({
  selector: 'cdp-select-control',
  template: `
    <ng-container *ngIf="control">
      <label [for]="control.propertyName">{{ control.label }}:</label>
      <input
        type="date"
        [id]="control.propertyName"
        [formControl]="$any(control.formControl)"
      />
    </ng-container>
  `,
})
export class DateControlComponent {
  @Input() control?: DateRunTimeControl;
}
