import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderItem, OrdersResponse } from '../../../models/order';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
import { UserOrderItemModalComponent } from '../user-order-item-modal/user-order-item-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css',
})
/*--------------------------------------------------------------------*/
export class UserOrdersComponent implements OnInit {
  // Component properties
  orders: Order[] = [];
  userOrdersCount: number = 0;
  totalProductsCount: number = 0;
  totalQuantity: number = 0;
  subtotal: number = 0;
  totalShippingFee: number = 0;
  grandTotal: number = 0;
  orderloading: boolean = true;
  apiError: string | null = null;
  noItems: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _OrderService: OrderService, private _ModalService: NgbModal, private _ToastrService: ToastrService) {}
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.loadOrders();
  }
  /*-----------------------------------------------------------------*/
  // load Orders
  private loadOrders(): void {
    this.orderloading = true;
    this.apiError = null;
    this._OrderService.getUserOrdersFromClaims().subscribe({
      next: (response: OrdersResponse) => {
        console.log(response.orders);

        this.orders = response.orders;
        this.userOrdersCount = response.userOrdersCount;
        this.calculateSummary();
        this.orderloading = false;
        this.noItems = this.userOrdersCount === 0;
      },
      error: (error) => {
        if (error.status === 404) {
          this.noItems = true;
          this.orderloading = false;
          this.apiError = null;
          return;
        }
        this.apiError = 'Failed to load orders. Please try again.';
        this.orderloading = false;
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
  openOrderItemModal(item: OrderItem): void {
    const modalRef = this._ModalService.open(UserOrderItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.item = item;
  }
  /*-----------------------------------------------------------------*/
  private calculateSummary(): void {
    this.totalProductsCount = 0;
    this.totalQuantity = 0;
    this.subtotal = 0;
    this.totalShippingFee = 0;
    this.grandTotal = 0;

    for (const order of this.orders) {
      this.totalProductsCount += order.orderItems.length;
      for (const item of order.orderItems) {
        this.totalQuantity += item.quantity;
        this.subtotal += item.quantity * item.itemPrice;
      }
      this.totalShippingFee += order.shippingPrice;
      this.grandTotal += order.totalOrderPrice;
    }
    this.grandTotal += this.totalShippingFee;
  }
  /*-----------------------------------------------------------------*/
}
