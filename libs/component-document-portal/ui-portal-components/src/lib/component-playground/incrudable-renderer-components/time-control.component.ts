import { Component, Input } from '@angular/core';
import { TimeRunTimeControl } from '@incrudable/forms';

@Component({
  selector: 'cdp-select-control',
  template: `
    <ng-container *ngIf="control">
      <label [for]="control.propertyName">{{ control.label }}:</label>
      <input
        type="time"
        [id]="control.propertyName"
        [formControl]="$any(control.formControl)"
      />
    </ng-container>
  `,
})
export class TimeControlComponent {
  @Input() control?: TimeRunTimeControl;
}
