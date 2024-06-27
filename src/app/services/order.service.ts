import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, tap } from 'rxjs';
import { CartService } from './cart.service';
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
  getUserOrdersFromClaims(): Observable<any> {
    return this._HttpClient.get<any>(`${this.baseUrl}/UserOrders`).pipe(delay(3000));
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
