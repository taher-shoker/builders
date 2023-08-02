import { Injectable } from '@angular/core';

import { DialogComponent } from './dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private modals: DialogComponent[] = [];

  add(modal: DialogComponent) {
    if (!modal.id || this.modals.find((x) => x.id === modal.id)) {
      throw new Error('modal must have a unique id attribute');
    } else {
      //this.modals.push(modal);
    }
    this.modals.push(modal);
    // add modal to array of active modals
  }

  remove(modal: DialogComponent) {
    // remove modal from array of active modals
    this.modals = this.modals.filter((x) => x === modal);
  }

  open(id: string) {
    // open modal specified by id
    const modal = this.modals.find((x) => x.id === id);
    if (!modal) {
      throw new Error(`modal '${id}' not found`);
    }

    modal.open();
  }

  close() {
    // close the modal that is currently open
    const modal = this.modals.find((x) => x.isOpen);
    modal?.close();
  }
}
