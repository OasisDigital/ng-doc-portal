import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'cdp-tab-item',
  template: `<ng-template #template><ng-content></ng-content></ng-template>`
})
export class TabItemComponent {
  @Input() title = 'Unnamed';
  @ViewChild('template') templateRef!: TemplateRef<any>;
}
