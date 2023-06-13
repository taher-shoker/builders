import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedUiModule } from '@stc-apps/shared-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CassesComponent } from './components/casses/casses.component';
import { CasseFormComponent } from './components/casse-form/casse-form.component';
import { AddCasseComponent } from './components/add-casse/add-casse.component';
import { EditCasseComponent } from './components/edit-casse/edit-casse.component';
import { MatTableModule } from '@angular/material/table';
import { CassesSettingRoutingModule } from './casses-setting-routing.module';
import { CasseDetailsComponent } from './components/casse-details/casse-details.component';

@NgModule({
  declarations: [
    CassesComponent,
    CasseFormComponent,
    AddCasseComponent,
    EditCasseComponent,
    CasseDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    CassesSettingRoutingModule,
  ],
  exports: [],
  providers: [],
})
export class CassesSettingModule {}
