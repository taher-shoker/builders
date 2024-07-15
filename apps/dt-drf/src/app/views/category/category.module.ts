import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { DyReportsModule } from '../dy-reports/dy-reports.module';
import { CategoryDialogComponent } from './categoryDialog/categoryDialog.component';

@NgModule({
  declarations: [CategoryComponent, CategoryDialogComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryRoutingModule,
    DyReportsModule,
  ],
  exports: [],
  providers: [],
})
export class CategoryModule {}
