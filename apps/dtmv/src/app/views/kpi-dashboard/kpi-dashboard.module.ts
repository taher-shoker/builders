import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiDashboardRoutingModule } from './kpi-dashboard-routing.module';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { KpiDashboardComponent } from './kpi-dashboard.component';
import { ActualProgressComponent } from './components/actual-progress/actual-progress.component';
import { ProgressGaugeComponent } from './components/progress-gauge/progress-gauge.component';
import { TabsNavigationComponent } from './components/tabs-navigation/tabs-navigation.component';
import { DiProgressComponent } from './components/di-progress/di-progress.component';
import { KpiListComponent } from './components/kpi-list/kpi-list.component';
import { KpiListItemComponent } from './components/kpi-list-item/kpi-list-item.component';
import { KpiListHeaderComponent } from './components/kpi-list-header/kpi-list-header.component';
import { KpiSearchComponent } from './components/kpi-search/kpi-search.component';
import { KpiListSectionComponent } from './components/kpi-list-section/kpi-list-section.component';
import { KpiActionsComponent } from './components/kpi-actions/kpi-actions.component';
import { KpiAttributesListComponent } from './components/kpi-attributes-list/kpi-attributes-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { KpiFormDialogComponent } from './components/kpi-form-dialog/kpi-form-dialog.component';
import { UpdateValueDialogComponent } from './components/update-value-dialog/update-value-dialog.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';

@NgModule({
  declarations: [
    KpiDashboardComponent,
    ActualProgressComponent,
    TabsNavigationComponent,
    DiProgressComponent,
    KpiListComponent,
    KpiListItemComponent,
    KpiListHeaderComponent,
    KpiSearchComponent,
    KpiListSectionComponent,
    KpiActionsComponent,
    KpiAttributesListComponent,
    KpiFormDialogComponent,
    UpdateValueDialogComponent,
    ActivityLogComponent,
    ProgressGaugeComponent
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule,
    KpiDashboardRoutingModule,
    MatTooltipModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatRadioModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule
  ],
})
export class KpiDashboardModule {}
