import { Route } from '@angular/router';
import { authGuard } from './services/guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'startChat', pathMatch: 'full' },
  {
    path: 'startChat',
    loadChildren: () =>
      import('./views/start-chat-view/start-chat-view.module').then(
        (m) => m.StartChatViewModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'chatView',
    loadChildren: () =>
      import('./views/chat-view/chat-view.module').then(
        (m) => m.ChatViewModule
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'startChat' },
];
