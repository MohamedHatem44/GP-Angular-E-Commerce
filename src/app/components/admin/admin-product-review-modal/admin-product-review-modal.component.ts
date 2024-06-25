import { Component, Input } from '@angular/core';
import { Review } from '../../../models/review';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-product-review-modal',
  templateUrl: './admin-product-review-modal.component.html',
  styleUrl: './admin-product-review-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminProductReviewModalComponent {
  @Input() review: Review;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
}
