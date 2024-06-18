import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-message-details-model',
  templateUrl: './admin-message-details-model.component.html',
  styleUrl: './admin-message-details-model.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminMessageDetailsModelComponent {
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
