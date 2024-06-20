import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class AuthService {
  private baseUrl = 'http://localhost:5185/api/Auth';
  userToken = new BehaviorSubject<any>(null);
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    const token = localStorage.getItem('token');
    if (token !== null) {
      this.userToken.next(token);
    }
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
    return this._HttpClient.post(`${this.baseUrl}/Login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.userToken.next(response.token);
      })
    );
  }
  /*------------------------------------------------------------------*/
  // Register
  // Post: api/Auth/Register
  register(user: { firstName: string; lastName: string; email: string; password: string }): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/Register`, user);
  }
  /*------------------------------------------------------------------*/
  // logout
  logout(): void {
    localStorage.removeItem('token');
    this.userToken.next(null);
    this._Router.navigate(['users/login']);
  }
  /*------------------------------------------------------------------*/
  // Get User Info
  // Post: api/Auth/Manage/Info
  getCurrentUserInfo(): Observable<User> {
    return this._HttpClient.get<User>(`${this.baseUrl}/Manage/Info`);
  }
  /*------------------------------------------------------------------*/
}
