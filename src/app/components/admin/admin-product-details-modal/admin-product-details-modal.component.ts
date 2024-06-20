import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-product-details-modal',
  templateUrl: './admin-product-details-modal.component.html',
  styleUrl: './admin-product-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminProductDetailsModalComponent {
  @Input() product: any;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
}
