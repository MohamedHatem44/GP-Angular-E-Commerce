import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Brand } from '../models/brand';
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
  getAllBrandsWithPagination(pageNumber: number, pageSize: number = 5, brandName?: string): Observable<Brand[]> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (brandName) {
      params = params.set('brandName', brandName);
    }
    return this._HttpClient.get<Brand[]>(`${this.baseUrl}/AllBrands`, { params }).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get list of Brands
  getAllBrands(): Observable<Brand[]> {
    return this._HttpClient.get<Brand[]>(this.baseUrl);
  }
  /*------------------------------------------------------------------*/
  // Get list of Brands with Products
  getAllBrandsWithProducts(): Observable<Brand[]> {
    return this._HttpClient.get<Brand[]>(this.baseUrl + '/BrandsWithProducts');
  }
  /*-----------------------------------------------------------------*/
  // Get specific Brand by id
  getBrandById(brandId: number): Observable<Brand> {
    return this._HttpClient.get<Brand>(`${this.baseUrl}/${brandId}`);
  }
  /*------------------------------------------------------------------*/
  // Create Brand
  createBrand(brand: FormData): Observable<Brand> {
    return this._HttpClient.post<Brand>(this.baseUrl, brand);
  }
  /*------------------------------------------------------------------*/
  // Update specific Brand
  updateBrand(brandId: number, brand: FormData): Observable<Brand> {
    return this._HttpClient.patch<Brand>(`${this.baseUrl}/${brandId}`, brand);
  }
  /*------------------------------------------------------------------*/
  // Delete specific Brand
  deleteBrand(brandId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${brandId}`);
  }
  /*------------------------------------------------------------------*/
}
