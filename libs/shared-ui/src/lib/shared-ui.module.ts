import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

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
import { ProgressCircleChartComponent } from './progress-circle-chart/progress-circle-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DatePickerWeeklyComponent } from './date-picker-weekly/date-picker-weekly.component';
import { DatePickerRangeComponent } from './date-picker-range/date-picker-range.component';
import { DatePickerWeeklyRangeComponent } from './date-picker-weekly-range/date-picker-weekly-range.component';
import { LocaleDatePipe } from './locale.date/locale.date.pipe';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { WeeklyLineChartComponent } from './weekly-line-chart/weekly-line-chart.component';
import { CounterCardComponent } from './counter-card/counter-card.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { SafeHtmlPipe } from './safe-html/safe-html.pipe';
import { PaginatorComponent } from './paginator/paginator.component';
import { SortableTableDirective } from './sorter/sorter.directive';
import { ActionsStepperComponent } from './actions-stepper/actions-stepper.component';
import { InputFullWidthComponent } from './input-full-width/input-full-width.component';
import { FilterArrayPipe } from './filter-array/filter-array.pipe';
import { DisplayCaptionPipe } from './actions-stepper/action.pipe';
import { NotificationsDropdownComponent } from './notifications-dropdown/notifications-dropdown.component';
import { DateAgoPipe } from './notifications-dropdown/date-ago.pipe';
import { TimelineChartComponent } from './timeline-chart/timeline-chart.component';
import { TextEditorQuillComponent } from './text-editor-quill/text-editor-quill.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TabviewComponent } from './tabview/tabview.component';
import { KpiCardComponent } from './kpi-card/kpi-card.component';
import { KpiStatusCardComponent } from './kpiStatusCard/kpi-status-card.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CircularProgressBarComponent } from './curcular-progress-bar/circular-progress-bar.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MillionPipe } from './million.pipe';
import { SolidCircularBarComponent } from './solid-circular-bar/solid-circular-bar.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { TabViewModule } from 'primeng/tabview';
import { MultiCirclesProgressBarComponent } from './multi-circles-progress-bar/multi-circles-progress-bar.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TruncateWordPipe } from './truncateWord.pipe';
import { CalendarModule } from 'primeng/calendar';
import { DialogModalComponent } from './file-upload-dialog/dialog.component';
import { FileUploadInputComponent } from './file-upload-input/file-upload-input.component';
import { DialogModule } from '@angular/cdk/dialog';
import { DialogModule as primengDialogModule } from 'primeng/dialog';
import { NewLinePipe } from './newLine.pipe';
import { MultiCirclesChartComponent } from './multi-circles-chart/multi-circles-chart.component';
import { SharedService } from './shared.service';
import { ClusteredColumnChartComponent } from './clustered-column-chart/clustered-column-chart.component';
const modules = [BreadCrumbModule, MatIconModule , CalendarModule];

const components = [
  ButtonComponent,
  TabviewComponent,
  KpiCardComponent,
  KpiStatusCardComponent,
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
  ProgressCircleChartComponent,
  LineChartComponent,
  BarChartComponent,
  DatePickerWeeklyComponent,
  DatePickerRangeComponent,
  DatePickerWeeklyRangeComponent,
  LocaleDatePipe,
  SafeHtmlPipe,
  DonutChartComponent,
  WeeklyLineChartComponent,
  CounterCardComponent,
  ItemsListComponent,
  CustomTableComponent,
  PaginatorComponent,
  SortableTableDirective,
  ActionsStepperComponent,
  InputFullWidthComponent,
  FilterArrayPipe,
  DisplayCaptionPipe,
  NotificationsDropdownComponent,
  TimelineChartComponent,
  TextEditorQuillComponent,
  CheckboxComponent,
  ProgressBarComponent,
  SidebarComponent,
  CircularProgressBarComponent,
  MillionPipe,
  SolidCircularBarComponent,
  ProjectCardComponent,
  MultiCirclesProgressBarComponent,
  ConfirmDialogComponent,
  TruncateWordPipe,
  DialogModalComponent,
  FileUploadInputComponent,
  NewLinePipe,
  MultiCirclesChartComponent,
  ClusteredColumnChartComponent
];

@NgModule({
  declarations: [...components],
  exports: [...components, ...modules ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' } , SharedService],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    RouterModule,
    LngSelectorModule,
    ModeToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MomentDateModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatExpansionModule,
    TranslateModule,
    MatProgressSpinnerModule,
    DateAgoPipe,
    NgCircleProgressModule.forRoot(),
    TabViewModule,
    OverlayPanelModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    CalendarModule,
    primengDialogModule
  ]
})
export class SharedUiModule {}
