import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, delay, tap } from 'rxjs';

import { WishList } from '../models/wishList';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class WishListService {
  baseUrl = 'http://localhost:5185/api/WishLists';
  /*------------------------------------------------------------------*/
  // BehaviorSubject to emit current list item count
  private wishListItemCountSubject: BehaviorSubject<number>;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {
    const storedItemCount = localStorage.getItem('wishListItemCount');
    this.wishListItemCountSubject = new BehaviorSubject<number>(storedItemCount ? +storedItemCount : 0);

    if (!storedItemCount) {
      this.updateWishListItemCount();
    }
  }
  /*------------------------------------------------------------------*/
  // Get a Specific User WishList By User Claims
  // Get: api/WishLists/UserWishList
  getWishListByUserFromClaims(): Observable<any> {
    return this._HttpClient.get<any>(`${this.baseUrl}/UserWishList`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Add Items To  WishList
  // Post: api/WishLists/AddAndRemoveFromWishList
  AddAndRemoveFromWishList(item: WishList): Observable<WishList> {
    return this._HttpClient.post<WishList>(`${this.baseUrl}/AddAndRemoveFromWishList`, item).pipe(
      delay(3000),
      tap(() => {
        this.updateWishListItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
  // Remove a Specific Item From WishList By User Claims and Item Id
  // Delete: api/WishLists/RemoveFromWishList/{id}
  deleteProItem(itemId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/RemoveFromWishList/${itemId}`).pipe(
      delay(3000),
      tap(() => {
        this.updateWishListItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
  // Remove a All Items From WishList By User Claims
  // Delete: api/WishLists/RemoveAllItemsFromWishList
  deleteAllItem(): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/RemoveAllItemsFromWishList`).pipe(
      delay(3000),
      tap(() => {
        this.updateWishListItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
  updateWishListItemCount(): void {
    this.getWishListByUserFromClaims().subscribe(
      (response) => {
        const itemCount = response.wishListItems.length;
        localStorage.setItem('wishListItemCount', itemCount.toString());
        this.wishListItemCountSubject.next(itemCount);
      },
      (error) => console.error('Error updating wish list item count:', error)
    );
  }
  /*------------------------------------------------------------------*/
  clearWishListItemCount() {
    localStorage.removeItem('wishListItemCount');
    this.wishListItemCountSubject.next(0);
  }
  /*------------------------------------------------------------------*/
  public get wishListItemCount$(): Observable<number> {
    return this.wishListItemCountSubject.asObservable();
  }
  /*------------------------------------------------------------------*/
}
