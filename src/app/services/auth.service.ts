import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class AuthService {
  private baseUrl = 'http://localhost:5185/api/Auth';
  userToken = new BehaviorSubject<any>(null);
  /*--------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    const token = localStorage.getItem('token');
    if (token !== null) {
      this.userToken.next(token);
    }
  }
  /*--------------------------------------------------------------------*/
  // Getter for user data
  get currentUser(): Observable<any> {
    return this.userToken.asObservable();
  }
  /*--------------------------------------------------------------------*/
  // Method to logout
  logout(): void {
    localStorage.removeItem('token');
    this.userToken.next(null);
    this._Router.navigate(['users/login']);
  }
  /*--------------------------------------------------------------------*/
  // Method to check authentication status
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  /*--------------------------------------------------------------------*/
  // Method to get token
  getToken() {
    return localStorage.getItem('token');
  }
  /*--------------------------------------------------------------------*/
  // Method to login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/Login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.userToken.next(response.token);
      })
    );
  }
  /*--------------------------------------------------------------------*/
  // Method to register a new user
  register(user: { fullName: string; email: string; password: string }): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/Register`, user);
  }
  /*--------------------------------------------------------------------*/
}
