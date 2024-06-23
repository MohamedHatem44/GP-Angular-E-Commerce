import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrl: './product-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class ProductDetailsModalComponent {
  @Input() product: Product;
  selectedColorId: number;
  selectedSizeId: number;
  quantity: number = 1;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
  increaseQuantity(): void {
    this.quantity++;
  }
  /*------------------------------------------------------------------*/
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  /*------------------------------------------------------------------*/
  addToCart() {
    console.log('Add To Cart');
  }
  /*------------------------------------------------------------------*/
}
