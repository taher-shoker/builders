import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LngSelectorModule } from '@stc-apps/lng-selector';
import { ModeToggleModule } from '@stc-apps/mode-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { ButtonComponent } from './button/button.component';
import { HeaderComponent } from './header/header.component';
import { InputComponent } from './input/input.component';
import { BreadCrumbModule } from './breadcrumb/breadcrumb.module';
import { BannerComponent } from './banner/banner.component';
import { FilterBoxComponent } from './filter-box/filter-box.component';
import { SelectDropDownComponent } from './select-dropDown/select-drop-down.component';
import { TableComponent } from './table/table.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { TextareaComponent } from './textarea/textarea.component';
import { DialogComponent } from './dialog/dialog.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { LocaleDatePipe } from './locale.date/locale.date.pipe';

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
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MomentDateModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatExpansionModule,
  ],
  declarations: [
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    BannerComponent,
    FilterBoxComponent,
    SelectDropDownComponent,
    TableComponent,
    FileUploaderComponent,
    TextareaComponent,
    DialogComponent,
    DatePickerComponent,
    LocaleDatePipe,
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
    FileUploaderComponent,
    TextareaComponent,
    DialogComponent,
    DatePickerComponent,
    LocaleDatePipe
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class SharedUiModule {}
