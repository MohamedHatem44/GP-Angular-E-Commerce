import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { uploadImage } from '../models/uploadImage';
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
  uploadImage(formFile: File, controllerName: string): Observable<uploadImage> {
    var form = new FormData();
    form.append('formFile', formFile);
    form.append('controllerName', controllerName);
    return this._HttpClient.post<uploadImage>(this.baseUrl, form);
  }
  /*------------------------------------------------------------------*/
}
