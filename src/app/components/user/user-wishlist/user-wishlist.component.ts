import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { WishListService } from '../../../services/wishList.service';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { ProductDetailsModalComponent } from '../../shop/product-details-modal/product-details-modal.component';
import { ProductService } from '../../../services/product.service';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-user-wishlist',
  templateUrl: './user-wishlist.component.html',
  styleUrl: './user-wishlist.component.css',
})
/*--------------------------------------------------------------------*/
export class UserWishlistComponent implements OnInit {
  // Component properties
  wishListLoading: boolean = false;
  productLoading: boolean = false;
  itemIdToDelete: number;
  wishList: any;
  wishListItems: (any & { deleting?: boolean })[] = [];
  apiError: string | null = null;
  noItems: boolean = false;
  deleteAllLoading: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(
    private _WishListService: WishListService,
    private _productService: ProductService,
    private _ModalService: NgbModal,
    private _ToastrService: ToastrService
  ) {}
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.getUserWishList();
  }
  /*-----------------------------------------------------------------*/
  // Get User WishList
  getUserWishList() {
    this.wishListLoading = true;
    this.apiError = null;
    this._WishListService.getWishListByUserFromClaims().subscribe({
      next: (response: any) => {
        this.wishList = response;
        this.wishListItems = this.wishList.wishListItems;
        this.wishListLoading = false;
        this.noItems = this.wishListItems.length === 0;
      },
      error: (err) => {
        if (err.status === 404) {
          this.noItems = true;
          this.wishListLoading = false;
          this.apiError = null;
          return;
        }
        this.apiError = 'Failed to load WishList, Please try again.';
        this._ToastrService.error('Failed to load WishList, Please try again.');
        this.wishListLoading = false;
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
    const item = this.wishListItems.find((item) => item.productId === itemId);
    if (item) {
      item.deleting = true;
      this._WishListService.deleteProItem(itemId).subscribe({
        next: () => {
          this.wishListItems = this.wishListItems.filter((item) => item.productId !== itemId);
          this._ToastrService.success('Item removed successfully');
          this.wishList.wishListItems.length--;
          this.noItems = this.wishListItems.length === 0;
        },
        error: (err) => {
          console.log(this._ToastrService.error(`${err.message}Failed to remove item, Please try again.`));

          item.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
  // Delete All Items
  deleteAllItems() {
    this.deleteAllLoading = true;
    this._WishListService.deleteAllItem().subscribe({
      next: () => {
        this.wishListItems = [];
        this.wishListItems.length = 0;
        this.wishList.itemsCount = 0;
        this._ToastrService.success('All Items removed successfully');
        this.deleteAllLoading = false;
        this.noItems = this.wishListItems.length === 0;
      },
      error: (err) => {
        this.deleteAllLoading = false;
        this._ToastrService.error('Failed to remove items, Please try again.');
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Open Product Details Modal
  openProductDetailsModal(productId: number): void {
    this.productLoading = true;

    this._productService.getSpecificProductWithDetails(productId).subscribe({
      next: (response: any) => {
        this.productLoading = false;
        const modalRef = this._ModalService.open(ProductDetailsModalComponent, { size: 'xl' });
        modalRef.componentInstance.product = response;
      },
      error: (err) => {
        this._ToastrService.error('Failed get producr data');
      },
    });
  }
  /*-----------------------------------------------------------------*/
}
