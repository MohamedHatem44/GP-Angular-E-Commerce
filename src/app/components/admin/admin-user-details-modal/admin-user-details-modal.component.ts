import { Component, Input } from '@angular/core';
import { User } from '../../../models/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-user-details-modal',
  templateUrl: './admin-user-details-modal.component.html',
  styleUrl: './admin-user-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminUserDetailsModalComponent {
  @Input() user: User;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
}
