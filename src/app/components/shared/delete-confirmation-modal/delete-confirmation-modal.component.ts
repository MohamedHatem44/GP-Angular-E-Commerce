import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.css',
})
export class DeleteConfirmationModalComponent {
  @Input() message: string;
  @Output() confirmDelete = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) {}
  confirmDeletion() {
    this.confirmDelete.emit();
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
