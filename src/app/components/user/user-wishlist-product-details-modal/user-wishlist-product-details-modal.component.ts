import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product';
import { CartService } from '../../../services/cart.service';
import { WishListService } from '../../../services/wishList.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../../models/cart';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-user-wishlist-product-details-modal',
  templateUrl: './user-wishlist-product-details-modal.component.html',
  styleUrl: './user-wishlist-product-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class UserWishlistProductDetailsModalComponent {
  @Input() product: Product;
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
    private _AuthService: AuthService,
    private _Router: Router,
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
      if (!this._AuthService.isAuthenticated()) {
        this.wishList = null;
        this.wishListItems = [];
        resolve();
        return;
      }
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
    const isAuthenticated = this._AuthService.isAuthenticated();
    if (!isAuthenticated) {
      this._ToastrService.error('To Have Access, Please login');
      this.addToCartLoading = false;
      this._ActiveModal.close();
      this._Router.navigate(['users/login']);
      return;
    }
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
}
