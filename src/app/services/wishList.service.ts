import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay } from 'rxjs';

import { WishList } from '../models/wishList';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class WishListService {
  baseUrl = 'http://localhost:5185/api/WishLists';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
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
    return this._HttpClient.post<WishList>(`${this.baseUrl}/AddAndRemoveFromWishList`, item).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Remove a Specific Item From WishList By User Claims and Item Id
  // Delete: api/WishLists/RemoveFromWishList/{id}
  deleteProItem(itemId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/RemoveFromWishList/${itemId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Remove a All Items From WishList By User Claims
  // Delete: api/WishLists/RemoveAllItemsFromWishList
  deleteAllItem(): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/RemoveAllItemsFromWishList`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
