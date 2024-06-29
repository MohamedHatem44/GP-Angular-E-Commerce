import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Color } from '../models/color';
import { PagedResponse } from '../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class ColorService {
  baseUrl = 'http://localhost:5185/api/Colors';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Colors With Pagination
  // Get: api/Colors/AllColors
  getAllColorsWithPagination(pageNumber: number, pageSize: number = 5, colorName?: string): Observable<PagedResponse<Color>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (colorName) {
      params = params.set('colorName', colorName);
    }
    return this._HttpClient.get<PagedResponse<Color>>(`${this.baseUrl}/AllColors`, { params }).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Get All Colors
  // Get: api/Colors
  getAllColors(): Observable<{ colorsCount: number; colors: Color[] }> {
    return this._HttpClient.get<{ colorsCount: number; colors: Color[] }>(this.baseUrl).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Color By Id
  // Get: api/Colors/{id}
  getColorById(colorId: number): Observable<Color> {
    return this._HttpClient.get<Color>(`${this.baseUrl}/${colorId}`).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Create a New Color
  // Post: api/Colors
  createColor(color: Color): Observable<Color> {
    return this._HttpClient.post<Color>(this.baseUrl, color).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Update Color
  // Put: api/Colors/{id}
  updateColor(colorId: number, color: Color): Observable<Color> {
    return this._HttpClient.put<Color>(`${this.baseUrl}/${colorId}`, color).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific Color By Id
  // Delete: api/Colors/{id}
  deleteColor(colorId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${colorId}`).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
}
