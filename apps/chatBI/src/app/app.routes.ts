import { Route } from '@angular/router';
import { ChatViewComponent } from './views/chat-view/chat-view.component';
import { StartChatViewComponent } from './views/start-chat-view/start-chat-view.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'startChat', pathMatch: 'full' },
  {
    path: 'startChat',
    loadChildren: () =>
      import('./views/start-chat-view/start-chat-view.module').then(
        (m) => m.StartChatViewModule
      ),
  },
  {
    path: 'chatView',
    loadChildren: () =>
      import('./views/chat-view/chat-view.module').then(
        (m) => m.ChatViewModule
      ),
  },
];
