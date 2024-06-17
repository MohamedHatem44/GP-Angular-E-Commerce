import { Component, Input } from '@angular/core';
import { Brand } from '../../../models/brand';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-brand-details-model',
  templateUrl: './admin-brand-details-model.component.html',
  styleUrl: './admin-brand-details-model.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminBrandDetailsModelComponent {
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
