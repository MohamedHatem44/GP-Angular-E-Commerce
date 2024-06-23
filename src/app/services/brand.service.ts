import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Brand } from '../models/brand';
import { PagedResponse } from '../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class BrandService {
  baseUrl = 'http://localhost:5185/api/Brands';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Brands With Related Products With Pagination
  // Get: api/Brands/AllBrands
  getAllBrandsWithPagination(pageNumber: number, pageSize: number = 5, brandName?: string): Observable<PagedResponse<Brand>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (brandName) {
      params = params.set('brandName', brandName);
    }
    return this._HttpClient.get<PagedResponse<Brand>>(`${this.baseUrl}/AllBrands`, { params }).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Brands Without Products
  // Get: api/Brands
  getAllBrands(): Observable<{ brandsCount: number; brands: Brand[] }> {
    return this._HttpClient.get<{ brandsCount: number; brands: Brand[] }>(this.baseUrl).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Brands With Products
  // Get: api/Brands/BrandsWithProducts
  getAllBrandsWithProducts(): Observable<{ brandsCount: number; brands: Brand[] }> {
    return this._HttpClient.get<{ brandsCount: number; brands: Brand[] }>(this.baseUrl + '/BrandsWithProducts').pipe(delay(3000));
  }
  /*-----------------------------------------------------------------*/
  // Get a Specific Brand By Id Without Products
  // Get: api/Brands/{id}
  getBrandById(brandId: number): Observable<Brand> {
    return this._HttpClient.get<Brand>(`${this.baseUrl}/${brandId}`);
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Brand By Id With Products
  // Get: api/Brands/{id}/BrandsWithProducts
  getBrandByIdWithProducts(brandId: number): Observable<Brand> {
    return this._HttpClient.get<Brand>(`${this.baseUrl}/${brandId}` + '/BrandsWithProducts');
  }
  /*------------------------------------------------------------------*/
  // Create a New Brand
  // Post: api/Brands
  createBrand(brand: Brand): Observable<Brand> {
    return this._HttpClient.post<Brand>(this.baseUrl, brand).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Update a Specific Brand With Id
  // Put: api/Brands/{id}
  updateBrand(brandId: number, brand: Brand): Observable<Brand> {
    return this._HttpClient.put<Brand>(`${this.baseUrl}/${brandId}`, brand).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific Brand By Id
  // Delete: api/Brands/{id}
  deleteBrand(brandId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${brandId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
