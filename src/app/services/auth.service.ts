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
  userData = new BehaviorSubject<any>(null);
  /*--------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient, private _Router: Router) {}
  /*--------------------------------------------------------------------*/
  // Getter for user data
  get currentUser(): Observable<any> {
    return this.userData.asObservable();
  }
  /*--------------------------------------------------------------------*/
  // Method to logout
  logout(): void {
    localStorage.removeItem('token');
    this.userData.next(null);
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
        this.userData.next(response.user);
      })
    );
  }
  /*--------------------------------------------------------------------*/
  // Method to register a new user
  register(user: { fullName: string; email: string; password: string }): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/Register`, user);
  }
  /*--------------------------------------------------------------------*/
  // Method to get current user data
  // getUserData(): void {
  //   if (this.isAuthenticated()) {
  //     this._HttpClient.get(`${this.baseUrl}/user`).subscribe(
  //       (user: any) => {
  //         this.userData.next(user);
  //       },
  //       (error) => {
  //         this.logout();
  //       }
  //     );
  //   }
  // }
  /*--------------------------------------------------------------------*/
}
