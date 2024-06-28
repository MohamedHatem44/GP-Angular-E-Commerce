import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderItem } from '../../../models/order';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-user-order-item-modal',
  templateUrl: './user-order-item-modal.component.html',
  styleUrl: './user-order-item-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class UserOrderItemModalComponent {
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
