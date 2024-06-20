import { Component, Input } from '@angular/core';
import { Brand } from '../../../models/brand';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-brand-details-modal',
  templateUrl: './admin-brand-details-modal.component.html',
  styleUrl: './admin-brand-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminBrandDetailsModalComponent {
  @Input() brand: Brand;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
}
