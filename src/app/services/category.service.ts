import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class CategoryService {
  baseUrl = 'http://localhost:5185/api/categories';
  /*--------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*-----------------------------------------------------------------*/
  // Get list of Categories
  getAllcategories(): Observable<Category[]> {
    return this._HttpClient.get<Category[]>(this.baseUrl);
  }
  /*-----------------------------------------------------------------*/
  // Get specific Category by id
  getCategoryById(categoryId: number): Observable<Category> {
    return this._HttpClient.get<Category>(`${this.baseUrl}/${categoryId}`);
  }
  /*-----------------------------------------------------------------*/
  // Create Category
  createCategory(category: FormData): Observable<Category> {
    return this._HttpClient.post<Category>(this.baseUrl, category);
  }
  /*-----------------------------------------------------------------*/
  // Update specific Category
  updateCategory(categoryId: number, category: FormData): Observable<Category> {
    return this._HttpClient.patch<Category>(`${this.baseUrl}/${categoryId}`, category);
  }
  /*-----------------------------------------------------------------*/
  // Delete specific Category
  deleteCategory(categoryId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${categoryId}`);
  }
  /*-----------------------------------------------------------------*/
}
