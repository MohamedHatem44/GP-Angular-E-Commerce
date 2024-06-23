import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Cart } from '../models/cart';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class CartService {
  baseUrl = 'http://localhost:5185/api/ShoppingCarts';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get a Specific Shopping Cart By User Claims
  // Get: api/ShoppingCarts/UserShoppingCart
  getShoppingCartByUserFromClaims(): Observable<any> {
    return this._HttpClient.get<any>(`${this.baseUrl}/UserShoppingCart`).pipe(delay(0));
  }
  /*------------------------------------------------------------------*/
  // Add Items To Shopping Cart
  // Post: api/ShoppingCarts/AddToCart
  addToCart(item: Cart): Observable<Cart> {
    return this._HttpClient.post<Cart>(`${this.baseUrl}/AddToCart`, item).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Edit Item Quantity in Shopping Cart
  // Patch: api/ShoppingCarts
  updateItemQuantity(dto: any): Observable<any> {
    return this._HttpClient.patch<any>(`${this.baseUrl}`, dto);
  }
  /*------------------------------------------------------------------*/
}
