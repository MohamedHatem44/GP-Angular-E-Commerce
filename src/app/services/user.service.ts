import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class UserService {
  baseUrl = 'http://localhost:5185/api/Users';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Users With Pagination
  // Get: api/Users/AllUsers
  getAllBrandsWithPagination(pageNumber: number, pageSize: number = 5, name?: string): Observable<User[]> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (name) {
      params = params.set('brandName', name);
    }
    return this._HttpClient.get<User[]>(`${this.baseUrl}/AllBrands`, { params }).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
