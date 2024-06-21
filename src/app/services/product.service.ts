import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Product } from '../models/product';
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
  async getAllProductsWithPaginationForAdmin(
    pageNumber: number,
    pageSize: number = 5,
    searchParam?: string,
    categoryId?: number,
    brandId?: number
  ): Promise<Observable<Product[]>> {
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

    return await this._HttpClient.get<Product[]>(`${this.baseUrl}/AllProducts`, { params }).pipe(delay(1));
  }
  /*------------------------------------------------------------------*/
  // Get All Products Without Details
  // Get: api/Products
  getAllProducts(): Observable<Product[]> {
    return this._HttpClient.get<Product[]>(this.baseUrl).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Products With Details
  // Get: api/Products/ProductsDetails
  getAllProductsWithDetails(): Observable<Product[]> {
    return this._HttpClient.get<Product[]>(`${this.baseUrl}/ProductsDetails`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Products With Details With optional parameters for Category Name, Brand Name and Product Title filtration
  // Get: api/Products/ProductsDetails/search
  /*------------------------------------------------------------------*/
  // Get All Products With Details With optional generic parameter
  // Get: api/Products/ProductsDetails/GenericSearch
  /*------------------------------------------------------------------*/
  // Get a Specific Product By Id Without Details
  // Get: api/Products/{id}
  getProductById(brandId: number): Observable<Product> {
    return this._HttpClient.get<Product>(`${this.baseUrl}/${brandId}`);
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Product By Id With Details
  // Get: api/Products/{id}/ProductsDetails
  getSpecificProductWithDetails(productId: number): Observable<Product> {
    return this._HttpClient.get<Product>(`${this.baseUrl}/ProductsDetails/${productId}`).pipe(delay(0));
  }
  /*------------------------------------------------------------------*/
  // Create a New Product
  // Post: api/Products
  createProduct(product: Product): Observable<Product> {
    return this._HttpClient.post<Product>(this.baseUrl, product).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Update a Specific Product With Id
  // Patch: api/Products/{id}/ProductsDetails
  updateProduct(productId: number, product: Product): Observable<Product> {
    return this._HttpClient.put<Product>(`${this.baseUrl}/${productId}`, product).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific Product With Id
  // Delete: api/Products/{id}
  deleteProduct(productId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${productId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
