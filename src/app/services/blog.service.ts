import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Blog } from '../models/blog';
import { Observable, delay } from 'rxjs';
import { PagedResponse } from '../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class BlogService {
  baseUrl = 'http://localhost:5185/api/Blogs';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Blogs With Pagination
  // Get: api/Blogs/AllBlogs
  getAllBlogsWithPagination(pageNumber: number, pageSize: number = 5, blogTitle?: string): Observable<PagedResponse<Blog>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (blogTitle) {
      params = params.set('blogTitle', blogTitle);
    }
    return this._HttpClient.get<PagedResponse<Blog>>(`${this.baseUrl}/AllBlogs`, { params }).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Get All Blogs
  // Get: api/Blogs
  getAllBlogs(): Observable<{ blogsCount: number; blogs: Blog[] }> {
    return this._HttpClient.get<{ blogsCount: number; blogs: Blog[] }>(this.baseUrl).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Blog By Id
  // Get: api/Blogs/{id}
  getBlogById(id: number): Observable<Blog> {
    return this._HttpClient.get<Blog>(`${this.baseUrl}/${id}`).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Blog By Id With User
  // Get: api/Blogs/AllBlogs/{id}
  getBlogByIdWithUser(id: number): Observable<Blog> {
    return this._HttpClient.get<Blog>(`${this.baseUrl}/AllBlogs/${id}`).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Create a New Blog
  // Post: api/Blogs
  createBlog(blog: Blog): Observable<Blog> {
    return this._HttpClient.post<Blog>(this.baseUrl, blog).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Update Blog
  // Put: api/Blogs/{id}
  updateBlog(id: number, blog: Blog): Observable<Blog> {
    return this._HttpClient.put<Blog>(`${this.baseUrl}/${id}`, blog).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific Blog By Id
  // Delete: api/Blogs/{id}
  deleteBlog(id: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${id}`).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
}
