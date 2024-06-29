import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Message } from '../models/message';
import { PagedResponse } from '../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class MessageService {
  baseUrl = 'http://localhost:5185/api/Messages';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _HttpClient: HttpClient) {}
  /*------------------------------------------------------------------*/
  // Get All Messages
  getAllMessages(): Observable<{ messagesCount: number; messages: Message[] }> {
    return this._HttpClient.get<{ messagesCount: number; messages: Message[] }>(this.baseUrl).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Get All Messages with Pagination
  getAllMessagesWithPagination(pageNumber: number): Observable<PagedResponse<Message>> {
    const params = new HttpParams().set('pageNumber', pageNumber);
    return this._HttpClient.get<PagedResponse<Message>>(`${this.baseUrl}/AllMessages`, { params }).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Message By Id
  getMessageById(messageId: number): Observable<Message> {
    return this._HttpClient.get<Message>(`${this.baseUrl}/${messageId}`).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Create a New Message
  createMessage(message: Message): Observable<Message> {
    return this._HttpClient.post<Message>(this.baseUrl, message).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
  // Delete a Specific Message By Id
  deleteMessage(messageId: number): Observable<Object> {
    return this._HttpClient.delete<Object>(`${this.baseUrl}/${messageId}`).pipe(delay(1000));
  }
  /*------------------------------------------------------------------*/
}
