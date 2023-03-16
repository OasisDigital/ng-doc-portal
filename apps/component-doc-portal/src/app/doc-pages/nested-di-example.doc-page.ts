import { Component } from '@angular/core';
import {
  NgDocPortalComponentsModule,
  DocPageConfig,
} from '@oasisdigital/ng-doc-portal';

import { ModalService } from './example-modal-system/modal.service';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
  template: ` <button (click)="modal.open()">Open Modal!</button> `,
})
export class NestedDIPageComponent {
  constructor(public modal: ModalService) {}
}

const docPageConfig: DocPageConfig = {
  title: 'General/Nested DI Example',
  component: NestedDIPageComponent,
};

export default docPageConfig;
