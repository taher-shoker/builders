import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-sector/src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  notificationBody,
  sectorUsersParams,
  user,
} from '../models/commentsModel';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  loggedUserObject: any;
  index = 0;
  mentionsList: BehaviorSubject<user[]> = new BehaviorSubject([{} as user]);
  mentionsObjects: any[] = [];
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    console.log(this.mentionsObjects, 'service');
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.authService.getUserData();
      this.authService.loggedUserStream.subscribe((res) => {
        console.log('logged in data', res);
        this.loggedUserObject = res;
      });
    }
  }
  addMentionObjects(mention: any): void {
    console.log('add mentions objects', this.mentionsObjects);
    let userObj: any;
    // eslint-disable-next-line prefer-const
    // userObj=mention;
    // userObj.index=this.index++;

    // eslint-disable-next-line prefer-const
    userObj = {
      ...mention,
      index: ++this.index,
    };
    console.log(userObj.index);

    this.mentionsObjects.push(userObj);
  }

  // Method to get the final array
  getmentionObjects(): any[] {
    return this.mentionsObjects;
  }
  commaSepartedMentions(mentions: any[]): string {
    //mentions=['nadeen draz','habiba mohamed'];
    let mentionsString = '';

    mentions.map((mention: any) => {
      if (typeof mention == 'object') {
        mentionsString =
          mentionsString +
          `${mention.id}|${mention.name}|${mention.email}|${mention.index}` +
          ',';
      } else if (typeof mention == 'string') {
        mentionsString = mentionsString + mention + ',';
      }
    });
    mentionsString = mentionsString.replace(/,\s*$/, '');
    return mentionsString;
  }
  getSectorUsers(params: sectorUsersParams): Observable<user[]> {
    const httpParams = new HttpParams()
      .set('system', params.system)
      .set('team', params.team);

    return this.http.get<user[]>(
      `${environment.apiUrl}v2/admin/compact-users/team`,
      { params: httpParams }
    );
  }

  notificationSender(notificationObject: notificationBody): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}v2/scrs/notification`,
      notificationObject
    );
  }
  notificationsSenderEngine(
    comment: any,
    mentionObjects: user[],
    commentID: number
  ) {
    const loggedInObj = {
      id: this.loggedUserObject.id,
      name: this.loggedUserObject.name,
      email: this.loggedUserObject.email,
      jobTitle: this.loggedUserObject.jobTitle,
    };

    const notificationBody = {
      commentId: commentID,
      mentioner: loggedInObj,
      mentionedList: mentionObjects,
      content: comment,
    };
    this.notificationSender(notificationBody).subscribe({
      next: () => {
        console.log('email.sent');
        this.toastr.success('Email sent to the mentioned users successfully');
      },
    });
  }
}
