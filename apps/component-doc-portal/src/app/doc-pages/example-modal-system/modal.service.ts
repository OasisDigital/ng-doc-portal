import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';

import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: Dialog) {}

  open() {
    return this.dialog.open(ModalComponent, {});
  }
}
