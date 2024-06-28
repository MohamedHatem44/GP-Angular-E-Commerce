import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order } from '@stripe/stripe-js';
import { PagedResponse } from '../../../models/pagedResponse';
import { AdminOrderDetailsModalComponent } from '../admin-order-details-modal/admin-order-details-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminOrdersComponent {
  // Component properties
  ordersLoading: boolean = false;
  orders: Order[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number = 5;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noOrders: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _OrderService: OrderService, private _ModalService: NgbModal, private _ToastrService: ToastrService) {}
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.fetchOrders(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Orders Method
  fetchOrders(page: number): void {
    this.ordersLoading = true;
    this.apiError = null;
    this.noOrders = false;

    this._OrderService.getAllOrdersWithPagination(page, this.pageSize).subscribe(
      (response: PagedResponse<Order>) => {
        this.orders = response.items;
        console.log(this.orders);

        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.ordersLoading = false;
        this.noOrders = this.orders.length === 0;
      },
      (error) => {
        this.ordersLoading = false;
        this.apiError = error;
        this._ToastrService.error('Failed to fetch orders. Please try again later.');
      }
    );
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.ordersLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchOrders(page);
    }
  }
  /*-----------------------------------------------------------------*/
  // Update Entry Range
  updateEntryRange(): void {
    this.startEntry = (this.currentPage - 1) * this.pageSize + 1;
    this.endEntry = Math.min(this.startEntry + this.pageSize - 1, this.totalCount);
  }
  /*-----------------------------------------------------------------*/
  get pages(): number[] {
    const half = Math.floor(this.maxPagesToShow / 2);
    let start = Math.max(this.currentPage - half, 1);
    let end = start + this.maxPagesToShow - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(end - this.maxPagesToShow + 1, 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  /*-----------------------------------------------------------------*/
  // Open Order Details Modal
  openOrderDetailsModal(order: Order): void {
    const modalRef = this._ModalService.open(AdminOrderDetailsModalComponent, { size: 'lg' });
    modalRef.componentInstance.order = order;
  }
  /*-----------------------------------------------------------------*/
}
