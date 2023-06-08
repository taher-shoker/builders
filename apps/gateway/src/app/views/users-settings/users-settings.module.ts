import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LngSelectorModule } from '@stc-apps/lng-selector';
import { SharedUiModule } from '@stc-apps/shared-ui';

import { UsersSettingsComponent } from './users-settings.component';
import { UsersSettingsRoutingModule } from './users-settings-routing.module';
import { UsersComponent } from './components/users/users.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';

@NgModule({
  declarations: [
    UsersSettingsComponent,
    UsersComponent,
    UserFormComponent,
    AddUserComponent,
    EditUserComponent,
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    RouterModule,
    LngSelectorModule,
    UsersSettingsRoutingModule,
  ],
})
export class UsersSettingsModule {}
