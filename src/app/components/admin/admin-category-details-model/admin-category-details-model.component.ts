import { Component, Input } from '@angular/core';
import { Category } from '../../../models/category';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-category-details-model',
  templateUrl: './admin-category-details-model.component.html',
  styleUrl: './admin-category-details-model.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminCategoryDetailsModelComponent {
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
