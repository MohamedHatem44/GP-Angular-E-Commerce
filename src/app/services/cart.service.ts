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
  // http://localhost:5185/api/ShoppingCarts/AddToCart
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Add Items To Shopping Cart
  // Post: api/ShoppingCarts/AddToCart
  addToCart(item: Cart): Observable<Cart> {
    return this._HttpClient.post<Cart>(`${this.baseUrl}/AddToCart`, item).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
