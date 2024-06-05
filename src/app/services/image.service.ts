import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class ImageService {
  baseUrl = 'http://localhost:5185/api/Images/Upload';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Upload Image
  uploadImage(image: FormData): Observable<FormData> {
    return this._HttpClient.post<FormData>(this.baseUrl, image);
  }
  /*------------------------------------------------------------------*/
}
