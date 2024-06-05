import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class ProductService {
  baseUrl = 'http://localhost:5185/api/products/ProductsDetails';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Messages
  getAllProducts(): Observable<any[]> {
    return this._HttpClient.get<any[]>(this.baseUrl).pipe(delay(5000));
  }
}
