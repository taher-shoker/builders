import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LngSelectorModule } from '@stc-apps/lng-selector';
import { SharedUiModule } from '@stc-apps/shared-ui';

import { UsersSettingsComponent } from './users-settings.component';
import { UsersSettingsRoutingModule } from './users-settings-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UsersSettingsComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule,
    LngSelectorModule,
    UsersSettingsRoutingModule,
  ],
})
export class UsersSettingsModule {}
