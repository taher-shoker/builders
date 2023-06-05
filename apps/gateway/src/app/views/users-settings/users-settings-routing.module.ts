import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersSettingsComponent } from './users-settings.component';
import { AddUserComponent } from './components/add-user/add-user.component';

const routes: Routes = [
  {
    path: '',
    component: UsersSettingsComponent,
    data: { breadcrumb: '' },
    children: [
      {
        path: 'add-user',
        component: AddUserComponent,
        data: { breadcrumb: 'add-user' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersSettingsRoutingModule {}
