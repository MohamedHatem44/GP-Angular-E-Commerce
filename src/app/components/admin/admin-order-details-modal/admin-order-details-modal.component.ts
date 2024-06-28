import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Order } from '../../../models/order';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
import { OrderItem } from '../../../models/order';
import { AdminOrderitemDetailsModalComponent } from '../admin-orderitem-details-modal/admin-orderitem-details-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-order-details-modal',
  templateUrl: './admin-order-details-modal.component.html',
  styleUrl: './admin-order-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminOrderDetailsModalComponent {
  @Input() order: Order;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal, private _ModalService: NgbModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
  // Open Img Modal
  openImgModal(item: any): void {
    const modalRef = this._ModalService.open(ImgModalComponent);
    modalRef.componentInstance.model = item;
  }
  /*-----------------------------------------------------------------*/
  openOrderItemModal(item: OrderItem): void {
    const modalRef = this._ModalService.open(AdminOrderitemDetailsModalComponent, { size: 'lg' });
    modalRef.componentInstance.item = item;
  }
  /*-----------------------------------------------------------------*/
}
