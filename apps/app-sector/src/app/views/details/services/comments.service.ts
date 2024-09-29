import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-sector/src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  addCommentBody,
  addreplyBody,
  comment,
  commentEditBody,
  reply,
  replyEditBody,
} from '../models/commentsModel';

@Injectable({ providedIn: 'root' })
export class commentsService {
  commentUrl =
    environment.apiUrl + 'v2/scrs/dashboard/sector/kpi-details/comment';
  replyUrl = `${this.commentUrl}/reply`;

  config = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  commenstList: BehaviorSubject<comment[]> = new BehaviorSubject([
    {} as comment,
  ]);

  constructor(private http: HttpClient) {}

  addComment(commentObject: addCommentBody): Observable<comment> {
    return this.http.post<comment>(`${this.commentUrl}`, commentObject);
  }

  deleteComment(commentID: number): Observable<any> {
    return this.http.delete<any>(`${this.commentUrl}/${commentID}`);
  }
  editComment(commentData: commentEditBody): Observable<comment> {
    return this.http.patch<comment>(`${this.commentUrl}`, commentData);
  }
  addReply(reply: addreplyBody): Observable<reply> {
    return this.http.post<reply>(`${this.replyUrl}`, reply, this.config);
  }
  editReply(replyData: replyEditBody): Observable<reply> {
    return this.http.patch<reply>(`${this.replyUrl}`, replyData);
  }
  deleteReply(replyID: number): Observable<any> {
    return this.http.delete<any>(`${this.replyUrl}/${replyID}`);
  }
}
