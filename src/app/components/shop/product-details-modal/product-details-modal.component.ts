import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../../models/cart';
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
  addToCartLoading: boolean = false;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _CartService: CartService, public _ActiveModal: NgbActiveModal, private _ToastrService: ToastrService) {}
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
    this.addToCartLoading = true;
    if (!this.selectedColorId || !this.selectedSizeId) {
      this._ToastrService.error('You must Select Color and Size');
      this.addToCartLoading = false;
      return;
    }
    if (this.quantity === 0) {
      this._ToastrService.error('Quantity must be at least 1');
      this.addToCartLoading = false;
      return;
    }
    const itemToAdd: Cart = {
      productId: this.product.id,
      colorId: this.selectedColorId,
      sizeId: this.selectedSizeId,
      quantity: this.quantity,
    };
    this._CartService.addToCart(itemToAdd).subscribe({
      next: (response: any) => {
        console.log('Item added to cart successfully:', response);
        this._ToastrService.success('Item added to cart successfully');
        this.addToCartLoading = false;
      },
      error: (error) => {
        console.error('Failed to add item to cart:', error);
        this._ToastrService.error('Failed to add item to cart');
        this.addToCartLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
}
