import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/chatBI/src/environments/environment';
import { chatBody, responseBody } from '../models/chatModel';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}
  baseURL = environment.apiUrl + 'v2/chatBI/chat';

  sendMessage(chatBody: chatBody): Observable<responseBody> {
    return this.http.post<responseBody>(this.baseURL, chatBody);
  }
}
