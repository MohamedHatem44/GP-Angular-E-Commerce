import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { User } from '../models/user';
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
  getAllUsersWithPagination(pageNumber: number, pageSize: number = 5, name?: string): Observable<User[]> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (name) {
      params = params.set('name', name);
    }
    return this._HttpClient.get<User[]>(`${this.baseUrl}/AllUsers`, { params }).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Toggle Active Status
  // Put: api/Users/ToggleActiveStatus/{id}
  toggleActiveStatus(userId: string): Observable<any> {
    return this._HttpClient.put<any>(`${this.baseUrl}/ToggleActiveStatus/${userId}`, {}).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific User By Id
  // Delete: api/Users/{id}
  deleteUser(userId: string): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${userId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
