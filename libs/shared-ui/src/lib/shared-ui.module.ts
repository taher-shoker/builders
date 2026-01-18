import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LngSelectorModule } from '@stc-apps/lng-selector';
import { ModeToggleModule } from '@stc-apps/mode-toggle';
import { SplitButtonModule } from 'primeng/splitbutton';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatMomentDateModule, MomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule as primengDialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { DisplayCaptionPipe } from './actions-stepper/action.pipe';
import { ActionsStepperComponent } from './actions-stepper/actions-stepper.component';
import { ActivityLogsPopupComponent } from './activity-logs-popup/activity-logs-popup.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { BannerComponent } from './banner/banner.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { BreadCrumbModule } from './breadcrumb/breadcrumb.module';
import { ButtonComponent } from './button/button.component';
import { TableChartComponent } from './chat-charts/table-chart/tableChart.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ClusteredColumnChartComponent } from './clustered-column-chart/clustered-column-chart.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CounterCardComponent } from './counter-card/counter-card.component';
import { CircularProgressBarComponent } from './curcular-progress-bar/circular-progress-bar.component';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.component';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { DatePickerRangeComponent } from './date-picker-range/date-picker-range.component';
import { DatePickerWeeklyRangeComponent } from './date-picker-weekly-range/date-picker-weekly-range.component';
import { DatePickerWeeklyComponent } from './date-picker-weekly/date-picker-weekly.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DialogComponent } from './dialog/dialog.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { DoubleLineChartComponent } from './double-line-chart/double-line-chart.component';
import { DialogModalComponent } from './file-upload-dialog/dialog.component';
import { FileUploadInputComponent } from './file-upload-input/file-upload-input.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FilterArrayPipe } from './filter-array/filter-array.pipe';
import { FilterBoxComponent } from './filter-box/filter-box.component';
import { FilterDropdownComponent } from './filter-dropdown/filter-dropdown.component';
import { HeaderComponent } from './header/header.component';
import { InputFullWidthComponent } from './input-full-width/input-full-width.component';
import { InputGroupComponent } from './input-group/input-group.component';
import { InputComponent } from './input/input.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { KpiCardComponent } from './kpi-card/kpi-card.component';
import { KpiStatusCardComponent } from './kpiStatusCard/kpi-status-card.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LocaleDatePipe } from './locale.date/locale.date.pipe';
import { MillionPipe } from './million.pipe';
import { MultiCirclesChartComponent } from './multi-circles-chart/multi-circles-chart.component';
import { MultiCirclesProgressBarComponent } from './multi-circles-progress-bar/multi-circles-progress-bar.component';
import { NewLinePipe } from './newLine.pipe';
import { DateAgoPipe } from './notifications-dropdown/date-ago.pipe';
import { NotificationsDropdownComponent } from './notifications-dropdown/notifications-dropdown.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ProgressCircleChartComponent } from './progress-circle-chart/progress-circle-chart.component';
import { ProgressCircleComponent } from './progress-circle/progress-circle.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { SafeHtmlPipe } from './safe-html/safe-html.pipe';
import { SelectDropDownComponent } from './select-dropDown/select-drop-down.component';
import { UtilitiesService } from './services/utilities.service';
import { SharedService } from './shared.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SolidCircularBarComponent } from './solid-circular-bar/solid-circular-bar.component';
import { SortableTableDirective } from './sorter/sorter.directive';
import { SplitButtonComponent } from './split-button/split-button.component';
import { TableComponent } from './table/table.component';
import { TabviewComponent } from './tabview/tabview.component';
import { TextEditorQuillComponent } from './text-editor-quill/text-editor-quill.component';
import { TextareaComponent } from './textarea/textarea.component';
import { TimelineChartComponent } from './timeline-chart/timeline-chart.component';
import { TruncateWordPipe } from './truncateWord.pipe';
import { WeeklyLineChartComponent } from './weekly-line-chart/weekly-line-chart.component';
const modules = [BreadCrumbModule, MatIconModule, CalendarModule];

import { SidebarModule } from 'primeng/sidebar';
import { BarChatChartComponent } from './chat-charts/bar-chart/barChart.component';
import { LineChatChartComponent } from './chat-charts/line-chart/lineChart.component';
import { PieChartComponent } from './chat-charts/pie-chart/pieChart.component';
import { ScatterChartComponent } from './chat-charts/scatter-chart/scatterChart.component';
import { EditModeViewComponent } from './edit-mode-view/edit-mode-view.component';
import { ExportImportBarComponent } from './export-import-bar/export-import-bar.component';
import { FormInputComponent } from './form-input/form-input.component';
import { FormSidebarComponent } from './form-sidebar/form-sidebar.component';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';
import { HeatmapPerformanceComponent } from './heatmap-performance/heatmap-performance.component';
import { HeatmapTableComponent } from './heatmap-table/heatmap-table.component';
import { MonthYearPickerComponent } from './month-year-picker/month-year-picker.component';
import { NumericInputComponent } from './numeric-input/numeric-input.component';
import { PageHeaderComponent } from './pageHeader/page-header.component';
import { ProgressChartComponent } from './progress-chart/progress-chart.component';
import { RadarBubbleChartComponent } from './radar-bubble-chart/radar-bubble-chart.component';
import { RoundedBarChartComponent } from './rounded-bar-chart/rounded-bar-chart.component';
import { TripleLineChartComponent } from './triple-line-chart/triple-line-chart.component';

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
  MonthYearPickerComponent,
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
  CustomDropdownComponent,
  ProgressCircleComponent,
  AttachmentsComponent,
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
  DoubleLineChartComponent,
  NewLinePipe,
  MultiCirclesChartComponent,
  ClusteredColumnChartComponent,
  GaugeChartComponent,
  ActivityLogsPopupComponent,
  SplitButtonComponent,
  InputGroupComponent,
  FilterDropdownComponent,
  TableChartComponent,
  LineChatChartComponent,
  BarChatChartComponent,
  PieChartComponent,
  ScatterChartComponent,
  PageHeaderComponent,
  FormInputComponent,
  EditModeViewComponent,
  ProgressChartComponent,
  NumericInputComponent,
  TripleLineChartComponent,
  RoundedBarChartComponent,
  ExportImportBarComponent,
  FormSidebarComponent,
];

@NgModule({
  declarations: [...components],
  exports: [...components, ...modules, RadarBubbleChartComponent, HeatmapTableComponent, HeatmapPerformanceComponent],
  providers: [
    UtilitiesService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    SharedService,
    DatePipe,
  ],
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
    primengDialogModule,
    SplitButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    DropdownModule,
    CarouselModule,
    SidebarModule,
    RadarBubbleChartComponent,
    HeatmapTableComponent,
    HeatmapPerformanceComponent
  ],
})
export class SharedUiModule {}
