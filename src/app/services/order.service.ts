import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, tap } from 'rxjs';
import { CartService } from './cart.service';
import { OrdersResponse } from '../models/order';
import { Order } from '@stripe/stripe-js';
import { PagedResponse } from '../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class OrderService {
  baseUrl = 'http://localhost:5185/api/Orders';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient, private _CartService: CartService) {}
  /*------------------------------------------------------------------*/
  // Get Orders By User Clamis
  // Get: api/Orders/UserOrders
  getUserOrdersFromClaims(): Observable<OrdersResponse> {
    return this._HttpClient.get<OrdersResponse>(`${this.baseUrl}/UserOrders`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Blogs With Pagination
  // Get: api/Orders/AllOrders
  getAllOrdersWithPagination(pageNumber: number, pageSize: number = 5): Observable<PagedResponse<Order>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this._HttpClient.get<PagedResponse<Order>>(`${this.baseUrl}/AllOrders`, { params }).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Create Order From Cart
  // Post: api/orders/CreateOrderFromCart
  createOrder(): Observable<any> {
    return this._HttpClient.post<any>(`${this.baseUrl}/CreateOrderFromCart`, {}).pipe(
      delay(3000),
      tap(() => {
        this._CartService.updateCartItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
}
