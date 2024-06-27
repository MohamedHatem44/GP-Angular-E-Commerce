import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { CartService } from './cart.service';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class AuthService {
  private baseUrl = 'http://localhost:5185/api/Auth';
  public userToken: BehaviorSubject<string | null>;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private http: HttpClient, private _Router: Router, private _CartService: CartService) {
    // const token = localStorage.getItem('token');
    // if (token !== null) {
    //   this.userToken.next(token);
    // }

    this.userToken = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  }
  /*------------------------------------------------------------------*/
  // Getter for user data
  get currentUser(): Observable<any> {
    return this.userToken.asObservable();
  }
  /*------------------------------------------------------------------*/
  // Method to check authentication status
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  /*------------------------------------------------------------------*/
  // Method to get token
  getToken() {
    return localStorage.getItem('token');
  }
  /*------------------------------------------------------------------*/
  // Login
  // Post: api/Auth/Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.userToken.next(response.token);

        // Update cart item count for the logged-in user
        this._CartService.updateCartItemCount();
      })
    );
  }
  /*------------------------------------------------------------------*/
  // Register
  // Post: api/Auth/Register
  register(user: { firstName: string; lastName: string; email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string; expiryDate: string }>(`${this.baseUrl}/Register`, user).pipe(
      tap<{ token: string; expiryDate: string }>((response) => {
        localStorage.setItem('token', response.token);
        this.userToken.next(response.token);
      })
    );
  }
  /*------------------------------------------------------------------*/
  // logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('cartItemCount');
    this.userToken.next(null);
    this._Router.navigate(['users/login']);
  }
  /*------------------------------------------------------------------*/
  // Get User Info
  // Post: api/Auth/Manage/Info
  getCurrentUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/Manage/Info`);
  }
  /*------------------------------------------------------------------*/

  // Update profile info
  updateProfileInfo(user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/UpdateUserInfo`, user);
  }
  /*------------------------------------------------------------------*/

  updateProfileImage(file: File): Observable<{ url?: string }> {
    const formData = new FormData();
    formData.append('formFile', file);
    return this.http.post<{ url?: string }>(`${this.baseUrl}/Upload`, formData);
  }
}
