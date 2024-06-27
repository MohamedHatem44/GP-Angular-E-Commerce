import { Component, Input, OnInit } from '@angular/core';
import { ExtendedProduct, Product } from '../../../models/product';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../../models/cart';
import { WishListService } from '../../../services/wishList.service';
import { WishList } from '../../../models/wishList';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrl: './product-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class ProductDetailsModalComponent implements OnInit {
  @Input() product: ExtendedProduct;
  selectedColorId: number;
  selectedSizeId: number;
  quantity: number = 1;
  addToCartLoading: boolean = false;

  wishList: any;
  wishListItems: any[] = [];
  apiError: string | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _CartService: CartService,
    private _WishListService: WishListService,
    public _ActiveModal: NgbActiveModal,
    private _ToastrService: ToastrService
  ) {}
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.loadWishList();
  }
  /*-----------------------------------------------------------------*/
  // Load WishList
  private async loadWishList(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._WishListService.getWishListByUserFromClaims().subscribe({
        next: (response: any) => {
          this.wishList = response;
          this.wishListItems = response.wishListItems;
          resolve();
        },
        error: (err) => {
          this.apiError = 'Failed to load WishList, Please try again.';
          reject(err);
        },
      });
    });
  }
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
  increaseQuantity(): void {
    const maxQuantity = 20;
    if (this.quantity >= maxQuantity) {
      this._ToastrService.error(`You can only add up to ${maxQuantity} items`);
      return;
    }
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
    if (this.quantity > 20) {
      this._ToastrService.error(`You can only add up to 20 items`);
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
        this._ToastrService.success('Item added to cart successfully');
        this.addToCartLoading = false;
      },
      error: (error) => {
        if (error.status === 400) {
          this._ToastrService.error(`This Product does not have enough quantity in stock, Only available ${this.product.quantity}`);
          return;
        } else {
          this._ToastrService.error('Failed to add item to cart');
        }
        this.addToCartLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Add / Remove from WishList
  addToWishList(product: ExtendedProduct) {
    product.isWishListLoading = true;
    const itemIdToAdd: WishList = {
      productId: product.id,
    };
    const isCurrentlyInWishList = product.isInWishList;
    this._WishListService.AddAndRemoveFromWishList(itemIdToAdd).subscribe({
      next: (response: any) => {
        if (isCurrentlyInWishList) {
          this._ToastrService.success('Product removed from wish list successfully');
        } else {
          this._ToastrService.success('Product added to wish list successfully');
        }
        product.isWishListLoading = false;
        this.updateProductWishListState(product);
      },
      error: (error) => {
        if (error.status === 400) {
          this._ToastrService.error('This Product Not Found');
        } else {
          this._ToastrService.error('Failed to add/remove item to/from wish list');
        }
        product.isWishListLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  private updateProductWishListState(product: ExtendedProduct): void {
    this.product.isInWishList = !this.product.isInWishList;
  }
  /*-----------------------------------------------------------------*/
  private isProductInWishList(productId: number): boolean {
    return this.wishListItems.some((item) => item.productId === productId);
  }
  /*-----------------------------------------------------------------*/
}
