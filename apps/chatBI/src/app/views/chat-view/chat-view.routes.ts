import { Route } from '@angular/router';
import { ChatViewComponent } from './chat-view.component';
import { authGuard } from '../../services/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'chatView',
    component: ChatViewComponent,
    canActivate: [authGuard],
  },
];
