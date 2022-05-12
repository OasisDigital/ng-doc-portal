import { Component, Input } from '@angular/core';
import { InputRunTimeControl } from '@incrudable/forms';

@Component({
  selector: 'cdp-input-control',
  styleUrls: ['./control.scss'],
  template: `
    <ng-container *ngIf="control">
      <label [for]="control.propertyName">{{ control.label }}:</label>
      <input
        [id]="control.propertyName"
        [formControl]="$any(control.formControl)"
      />
    </ng-container>
  `,
})
export class InputControlComponent {
  @Input() control?: InputRunTimeControl;
}
