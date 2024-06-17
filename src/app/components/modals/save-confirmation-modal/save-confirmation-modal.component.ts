import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-save-confirmation-modal',
  templateUrl: './save-confirmation-modal.component.html',
  styleUrl: './save-confirmation-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class SaveConfirmationModalComponent {
  @Input() message: string;
  @Output() confirmSave = new EventEmitter<void>();
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  confirmSaveChanges() {
    this.confirmSave.emit();
    this._ActiveModal.close();
  }
  /*-----------------------------------------------------------------*/
  dismiss() {
    this._ActiveModal.dismiss();
  }
  /*-----------------------------------------------------------------*/
}
