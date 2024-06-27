import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, tap } from 'rxjs';
import { Cart } from '../models/cart';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class CartService {
  baseUrl = 'http://localhost:5185/api/ShoppingCarts';
  /*------------------------------------------------------------------*/
  // BehaviorSubject to emit current cart item count
  private cartItemCountSubject: BehaviorSubject<number>;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {
    const storedItemCount = localStorage.getItem('cartItemCount');
    this.cartItemCountSubject = new BehaviorSubject<number>(storedItemCount ? +storedItemCount : 0);

    if (!storedItemCount) {
      this.updateCartItemCount();
    }
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Shopping Cart By User Claims
  // Get: api/ShoppingCarts/UserShoppingCart
  getShoppingCartByUserFromClaims(): Observable<any> {
    return this._HttpClient.get<any>(`${this.baseUrl}/UserShoppingCart`).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Add Items To Shopping Cart
  // Post: api/ShoppingCarts/AddToCart
  addToCart(item: Cart): Observable<Cart> {
    return this._HttpClient.post<Cart>(`${this.baseUrl}/AddToCart`, item).pipe(
      delay(3000),
      tap(() => {
        this.updateCartItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
  // Remove a Specific Item From Shopping Cart By User Claims and Item Id
  // Delete: api/ShoppingCarts/RemoveItemFromCart/{id}
  deleteItem(itemId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/RemoveItemFromCart/${itemId}`).pipe(
      delay(3000),
      tap(() => {
        this.updateCartItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
  // Remove a All Items From Shopping Cart By User Claims
  // Delete: api/ShoppingCarts/RemoveAllItemsFromCart
  deleteAllItem(): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/RemoveAllItemsFromCart`).pipe(
      delay(3000),
      tap(() => {
        this.updateCartItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
  // Edit Item Quantity in Shopping Cart
  // Patch: api/ShoppingCarts
  updateItemQuantity(dto: any): Observable<any> {
    return this._HttpClient.patch<any>(`${this.baseUrl}`, dto).pipe(
      tap(() => {
        this.updateCartItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
  updateCartItemCount(): void {
    this.getShoppingCartByUserFromClaims().subscribe(
      (response) => {
        const itemCount = response.itemsCount;
        localStorage.setItem('cartItemCount', itemCount.toString());
        this.cartItemCountSubject.next(itemCount);
      },
      (error) => console.error('Error updating cart item count:', error)
    );
  }
  /*------------------------------------------------------------------*/
  clearCartItemCount() {
    localStorage.removeItem('cartItemCount');
    this.cartItemCountSubject.next(0);
  }
  /*------------------------------------------------------------------*/
  public get cartItemCount$(): Observable<number> {
    return this.cartItemCountSubject.asObservable();
  }
  /*------------------------------------------------------------------*/
}
