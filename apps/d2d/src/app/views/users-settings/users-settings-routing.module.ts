import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersSettingsComponent } from './users-settings.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UsersComponent } from './components/users/users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';

const routes: Routes = [
  {
    path: '',
    component: UsersSettingsComponent,
    data: { breadcrumb: '' },
    children: [
      {
        path: '',
        component: UsersComponent,
        data: { breadcrumb: '' },
      },
      {
        path: 'add-user',
        component: AddUserComponent,
        data: { breadcrumb: 'add_user' },
      },
      {
        path: 'edit-user/:id',
        component: EditUserComponent,
        data: { breadcrumb: 'edit_user' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersSettingsRoutingModule {}
