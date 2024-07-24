import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DyReportsModule } from '../dy-reports/dy-reports.module';
import { DelegationDialogComponent } from './delegationDialog/delegationDialog.component';

@NgModule({
  declarations: [HomeComponent, DelegationDialogComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSortModule,
    HomeRoutingModule,
    DyReportsModule,
  ],
  exports: [],
  providers: [],
})
export class HomeModule {}
