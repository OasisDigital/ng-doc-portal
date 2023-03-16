import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'ngdp-tab-item',
  standalone: true,
  template: `<ng-template #template><ng-content></ng-content></ng-template>`,
})
export class TabItemComponent {
  @Input() title = '';
  @ViewChild('template') templateRef!: TemplateRef<any>;
}
