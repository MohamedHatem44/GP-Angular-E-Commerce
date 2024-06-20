import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-message-details-modal',
  templateUrl: './admin-message-details-modal.component.html',
  styleUrl: './admin-message-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminMessageDetailsModalComponent {
  @Input() message: Message;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
}
