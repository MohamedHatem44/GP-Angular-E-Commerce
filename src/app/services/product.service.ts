import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Product } from '../models/product';
import { PagedResponse } from '../models/pagedResponse';
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
  // Get: api/Products/AllProductsForAdmin
  async getAllProductsWithPaginationForAdmin(
    pageNumber: number,
    pageSize: number = 5,
    searchParam?: string,
    categoryId?: number,
    brandId?: number
  ): Promise<Observable<PagedResponse<Product>>> {
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

    return await this._HttpClient.get<PagedResponse<Product>>(`${this.baseUrl}/AllProductsForAdmin`, { params });
  }
  /*------------------------------------------------------------------*/
  // Get All Products With Details With Pagination For User
  // Get: api/Products/AllProductsForUser
  async getAllProductsWithPaginationForUser(
    pageNumber: number,
    pageSize: number = 9,
    searchParam?: string,
    categoryId?: number,
    brandId?: number,
    colorId?: number,
    sizeId?: number,
    minPrice?: number,
    maxPrice?: number
  ): Promise<Observable<PagedResponse<Product>>> {
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

    if (colorId !== undefined && colorId !== null) {
      params = params.set('colorId', colorId);
    }

    if (sizeId !== undefined && sizeId !== null) {
      params = params.set('sizeId', sizeId);
    }

    if (minPrice !== undefined && minPrice !== null) {
      params = params.set('minPrice', minPrice.toString());
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    return await this._HttpClient.get<PagedResponse<Product>>(`${this.baseUrl}/AllProductsForUser`, { params });
  }
  /*------------------------------------------------------------------*/
  // Get All Products Without Details
  // Get: api/Products
  getAllProducts(): Observable<{ productsCount: number; products: Product[] }> {
    return this._HttpClient.get<{ productsCount: number; products: Product[] }>(this.baseUrl).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Products With Details
  // Get: api/Products/ProductsDetails
  getAllProductsWithDetails(): Observable<{ productsCount: number; products: Product[] }> {
    return this._HttpClient.get<{ productsCount: number; products: Product[] }>(`${this.baseUrl}/ProductsDetails`).pipe(delay(3000));
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
  getProductById(productId: number): Observable<Product> {
    return this._HttpClient.get<Product>(`${this.baseUrl}/${productId}`);
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Product By Id With Details
  // Get: api/Products/{id}/ProductsDetails
  getSpecificProductWithDetails(productId: number): Observable<Product> {
    return this._HttpClient.get<Product>(`${this.baseUrl}/ProductsDetails/${productId}`).pipe(delay(3000));
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
