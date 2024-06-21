import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class ReviewService {
  baseUrl = 'http://localhost:5185/api/Reviews';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Reviews With Pagination
  // Get: api/Reviews/AllReviews
  /*------------------------------------------------------------------*/
  // Get All Reviews
  // Get: api/Reviews
  /*------------------------------------------------------------------*/
  // Get All Reviews for one Product By Product Id
  // Get: api/Reviews/ProductReviews/{Id}
  getAllReviewsByProductId(productId: number): Observable<Review[]> {
    return this._HttpClient.get<Review[]>(`${this.baseUrl}/ProductReviews/${productId}`);
  }
  /*------------------------------------------------------------------*/
  // Get All Reviews for one User By User Id
  // Get: api/Reviews/UserReviews
  /*------------------------------------------------------------------*/
  // Get Review By User Id and Product Id
  // Get: api/Reviews/UserReviews

  /*------------------------------------------------------------------*/
  // Create a New Review
  // Post: api/Reviews
  /*------------------------------------------------------------------*/
}
