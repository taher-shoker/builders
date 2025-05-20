import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'apps/nokiaChat/src/environments/environment';
import { chatBody, responseBody } from '../models/chat-view.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}
  baseURL = environment.apiUrl + 'v2/fni-nokia/chat';

  sendMessage(chatBody: chatBody): Observable<responseBody> {
    return this.http.post<responseBody>(this.baseURL, chatBody);
  }
}
