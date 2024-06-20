import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class ProductService {
  baseUrl = 'http://localhost:5185/api/Products';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Products With Details With Pagination For Admin
  // Get: api/Products/AllProducts
  getAllProductsWithPaginationForAdmin(pageNumber: number, pageSize: number = 5, searchParam?: string, categoryId?: number, brandId?: number): Observable<any> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    if (searchParam) {
      params = params.set('searchParam', searchParam);
    }

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId);
    }

    if (brandId !== undefined && brandId !== null) {
      params = params.set('brandId', brandId);
    }

    return this._HttpClient.get<any>(`${this.baseUrl}/AllProducts`, { params }).pipe(delay(30));
  }
  /*------------------------------------------------------------------*/
  // Get All Products Without Details
  // Get: api/Products
  getAllProducts(): Observable<any[]> {
    return this._HttpClient.get<any[]>(this.baseUrl).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Products With Details
  // Get: api/Products/ProductsDetails
  getAllProductsWithDetails(): Observable<any[]> {
    return this._HttpClient.get<any[]>(`${this.baseUrl}/ProductsDetails`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific Product With Id
  // Delete: api/Products/{id}
  deleteProduct(productId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${productId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
