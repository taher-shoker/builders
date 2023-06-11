import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { LngSelectorModule } from '@stc-apps/lng-selector';
import { ModeToggleModule } from '@stc-apps/mode-toggle';

import { ButtonComponent } from './button/button.component';
import { HeaderComponent } from './header/header.component';
import { InputComponent } from './input/input.component';
import { BreadCrumbModule } from './breadcrumb/breadcrumb.module';
import { BannerComponent } from './banner/banner.component';
import { FilterBoxComponent } from './filter-box/filter-box.component';
import { SelectDropDownComponent } from './select-dropDown/select-drop-down.component';
import { TableComponent } from './table/table.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LngSelectorModule,
    BreadCrumbModule,
    ModeToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
  ],
  declarations: [
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    BannerComponent,
    FilterBoxComponent,
    SelectDropDownComponent,
    TableComponent,
  ],
  exports: [
    HeaderComponent,
    BreadCrumbModule,
    InputComponent,
    ButtonComponent,
    BannerComponent,
    FilterBoxComponent,
    SelectDropDownComponent,
    TableComponent,
  ],
})
export class SharedUiModule {}
