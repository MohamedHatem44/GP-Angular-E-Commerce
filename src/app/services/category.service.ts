import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Category } from '../models/category';
import { PagedResponse } from '../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class CategoryService {
  baseUrl = 'http://localhost:5185/api/Categories';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Categories With Related Products With Pagination
  // Get: api/Categories/AllCategories
  getAllCategoriesWithPagination(pageNumber: number, pageSize: number = 5, categoryName?: string): Observable<PagedResponse<Category>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (categoryName) {
      params = params.set('categoryName', categoryName);
    }
    return this._HttpClient.get<PagedResponse<Category>>(`${this.baseUrl}/AllCategories`, { params }).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get All Categories Without Products
  // Get: api/Categories
  getAllCategories(): Observable<{ categoriesCount: number; categories: Category[] }> {
    return this._HttpClient.get<{ categoriesCount: number; categories: Category[] }>(this.baseUrl).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Get All Categories With Products
  // Get: api/Categories/CategoriesWithProducts
  getAllCategoriesWithProducts(): Observable<{ categoriesCount: number; categories: Category[] }> {
    return this._HttpClient.get<{ categoriesCount: number; categories: Category[] }>(this.baseUrl + '/CategoriesWithProducts').pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Category By Id Without Products
  // Get: api/Categories/{id}
  getCategoryById(categoryId: number): Observable<Category> {
    return this._HttpClient.get<Category>(`${this.baseUrl}/${categoryId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Category By Id With Products
  // Get: api/Categories/{id}/CategoriesWithProducts
  getCategoryByIdWithProducts(categoryId: number): Observable<Category> {
    return this._HttpClient.get<Category>(`${this.baseUrl}/${categoryId}` + '/CategoriesWithProducts').pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Create a New Category
  // Post: api/Categories
  createCategory(category: Category): Observable<Category> {
    return this._HttpClient.post<Category>(this.baseUrl, category).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Update a Specific Category With Id
  // Put: api/Categories/{id}
  updateCategory(categoryId: number, category: Category): Observable<Category> {
    return this._HttpClient.put<Category>(`${this.baseUrl}/${categoryId}`, category).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific Category With Id
  // Delete: api/Categories/{id}
  deleteCategory(categoryId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${categoryId}`).pipe(delay(3000));
  }
  /*------------------------------------------------------------------*/
}
