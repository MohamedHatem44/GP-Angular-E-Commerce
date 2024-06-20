import { Component, Input } from '@angular/core';
import { Category } from '../../../models/category';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-category-details-modal',
  templateUrl: './admin-category-details-modal.component.html',
  styleUrl: './admin-category-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminCategoryDetailsModalComponent {
  @Input() category: Category;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
}
