import { Route } from '@angular/router';
import { StartChatViewComponent } from './start-chat-view.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'startChat', pathMatch: 'full' },
  {
    path: '',
    component: StartChatViewComponent,
  },
];
