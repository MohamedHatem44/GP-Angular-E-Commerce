import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
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
  itemIdToDelete: number;
  shoppingCart: any;
  cartItems: (any & { deleting?: boolean })[] = [];
  apiError: string | null = null;
  noItems: boolean = false;
  deleteAllLoading: boolean = false;
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
        this.noItems = this.cartItems.length === 0;
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
  // Open Delete Item Confirmation Modal
  openDeleteItemConfirmationModal(itemId: number): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    this.itemIdToDelete = itemId;
    modalRef.componentInstance.message = `Are you sure you want to remove this item from cart?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteItem(itemId);
    });
  }
  /*-----------------------------------------------------------------*/
  // Open Delete All Item Confirmation Modal
  openDeleteAllItemConfirmationModal(): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.message = `Are you sure you want to remove all items from cart?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteAllItems();
    });
  }
  /*-----------------------------------------------------------------*/
  // Delete Item
  deleteItem(itemId: number): void {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (item) {
      item.deleting = true;
      this._CartService.deleteItem(itemId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
          this.shoppingCart.itemsCount = this.shoppingCart.itemsCount - item.quantity;
          this.shoppingCart.cartItems.length--;
          this._ToastrService.success('Item removed successfully');
        },
        error: (err) => {
          console.log(err);

          this._ToastrService.error('Failed to remove item, Please try again.');
          item.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
  // Delete All Items
  deleteAllItems() {
    this.deleteAllLoading = true;
    this._CartService.deleteAllItem().subscribe({
      next: () => {
        this.cartItems = [];
        this.shoppingCart.itemsCount = 0;
        this.shoppingCart.cartItems.length = 0;
        this._ToastrService.success('All Items removed successfully');
        this.deleteAllLoading = false;
      },
      error: (err) => {
        this.deleteAllLoading = false;
        this._ToastrService.error('Failed to remove items, Please try again.');
      },
    });
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
