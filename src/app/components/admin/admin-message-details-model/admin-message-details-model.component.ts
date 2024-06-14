import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-message-details-model',
  templateUrl: './admin-message-details-model.component.html',
  styleUrl: './admin-message-details-model.component.css',
})
export class AdminMessageDetailsModelComponent {
  @Input() message: any;

  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
