import { Component, Input } from '@angular/core';
import { OrderItem } from '../../../models/order';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-orderitem-details-modal',
  templateUrl: './admin-orderitem-details-modal.component.html',
  styleUrl: './admin-orderitem-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminOrderitemDetailsModalComponent {
  @Input() item: OrderItem;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
}
