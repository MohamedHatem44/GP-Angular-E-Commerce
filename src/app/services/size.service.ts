import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay } from 'rxjs';
import { Injectable } from '@angular/core';
import { Size } from '../models/size';
import { PagedResponse } from '../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class SizeService {
  baseUrl = 'http://localhost:5185/api/Sizes';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Sizes With Pagination
  // Get: api/Sizes/AllSizes
  getAllSizesWithPagination(pageNumber: number, pageSize: number = 5, sizeName?: string): Observable<PagedResponse<Size>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (sizeName) {
      params = params.set('sizeName', sizeName);
    }
    return this._HttpClient.get<PagedResponse<Size>>(`${this.baseUrl}/AllSizes`, { params }).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Sizes
  // Get: api/Sizes
  getAllSizes(): Observable<{ sizesCount: number; sizes: Size[] }> {
    return this._HttpClient.get<{ sizesCount: number; sizes: Size[] }>(this.baseUrl).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Size By Id
  // Get: api/Sizes/{id}
  getSizeById(sizeId: number): Observable<Size> {
    return this._HttpClient.get<Size>(`${this.baseUrl}/${sizeId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Create a New Size
  // Post: api/Sizes
  createSize(size: Size): Observable<Size> {
    return this._HttpClient.post<Size>(this.baseUrl, size).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Update Size
  // Put: api/Sizes/{id}
  updateSize(sizeId: number, size: Size): Observable<Size> {
    return this._HttpClient.put<Size>(`${this.baseUrl}/${sizeId}`, size).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific Size By Id
  // Delete: api/Sizes/{id}
  deleteSize(sizeId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${sizeId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
