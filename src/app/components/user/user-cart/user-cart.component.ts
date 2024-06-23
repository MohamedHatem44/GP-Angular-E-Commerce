import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrl: './user-cart.component.css',
})
/*--------------------------------------------------------------------*/
export class UserCartComponent implements OnInit {
  // Component properties
  cartLoading: boolean = false;
  brandIdToDelete: number;
  shoppingCart: any;
  cartItems: any[];
  // brands: (Brand & { deleting?: boolean })[] = [];
  apiError: string | null = null;
  noItems: boolean = false;
  searchInput: string = '';
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _CartService: CartService, private _ModalService: NgbModal, private _ToastrService: ToastrService) {}
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.getUserCart();
  }
  /*-----------------------------------------------------------------*/
  getUserCart() {
    this.cartLoading = true;
    this.apiError = null;
    this._CartService.getShoppingCartByUserFromClaims().subscribe({
      next: (response: any) => {
        this.shoppingCart = response;
        console.log(this.shoppingCart);

        this.cartItems = this.shoppingCart.cartItems;
        console.log(this.cartItems);

        this.cartLoading = false;
        // this.noItems = this.brands.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Cart, Please try again.';
        this._ToastrService.error('Failed to load Cart, Please try again.');
        this.cartLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Open Img Modal
  openImgModal(item: any): void {
    const modalRef = this._ModalService.open(ImgModalComponent);
    modalRef.componentInstance.model = item;
  }
  /*-----------------------------------------------------------------*/
  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateItemQuantity(item);
    }
  }
  /*-----------------------------------------------------------------*/
  increaseQuantity(item: any) {
    const maxQuantity = 20;
    if (item.quantity >= maxQuantity) {
      this._ToastrService.error(`You can only add up to ${maxQuantity} items.`);
      return;
    }
    item.quantity++;
    this.updateItemQuantity(item);
  }
  /*-----------------------------------------------------------------*/
  updateItemQuantity(item: any) {
    const dto = { itemId: item.id, quantity: item.quantity };
    this._CartService.updateItemQuantity(dto).subscribe({
      next: (response: any) => {
        const index = this.cartItems.findIndex((i) => i.id === item.id);
        if (index !== -1) {
          this.cartItems[index].totalItemPrice = item.quantity * item.itemPrice;
        }
        this.shoppingCart.itemsCount = this.calculateTotalItemsCount();
        this.shoppingCart.totalCartPrice = this.calculateTotalCartPrice();
      },
      error: (error) => {
        if (error.status === 400) {
          item.quantity--;
          this._ToastrService.error(`This Product does not have enough quantity in stock, Only available ${item.quantity}`);
          return;
        } else {
          this._ToastrService.error('Failed to update quantity');
        }
      },
    });
  }
  /*-----------------------------------------------------------------*/
  private calculateTotalItemsCount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }
  /*-----------------------------------------------------------------*/
  private calculateTotalCartPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity * item.itemPrice, 0);
  }
  /*-----------------------------------------------------------------*/
}
