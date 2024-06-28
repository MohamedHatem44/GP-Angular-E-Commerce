import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { CartService } from './cart.service';
import { WishListService } from './wishList.service';
import { JwtService } from './jwt.service';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class AuthService {
  private baseUrl = 'http://localhost:5185/api/Auth';

  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;
  public userToken: BehaviorSubject<string | null>;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private http: HttpClient,
    private _Router: Router,
    private _CartService: CartService,
    private _WishListService: WishListService,
    private _JwtService: JwtService
  ) {
    this.userToken = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
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
        this.isLoggedInSubject.next(true);
        // Update cart item and wishList count for the logged-in user
        this.updateCartAndWishlistCounts();
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
    localStorage.removeItem('wishListItemCount');
    this.isLoggedInSubject.next(false);
    this.userToken.next(null);
    this._CartService.clearCartItemCount();
    this._WishListService.clearWishListItemCount();
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
  /*------------------------------------------------------------------*/
  // Update cart item and wishList count for the logged-in user
  private updateCartAndWishlistCounts() {
    const token = this.getToken();
    if (token) {
      const role = this._JwtService.getRoleFromToken(token);
      if (role !== 'Admin') {
        this._CartService.updateCartItemCount();
        this._WishListService.updateWishListItemCount();
      }
    }
  }
  /*------------------------------------------------------------------*/
  updatePassword(body: { oldPassword: string; password: string }) {
    return this.http.patch<unknown>(`${this.baseUrl}/UpdateUserPass`, body);
  }
  /*------------------------------------------------------------------*/
}
