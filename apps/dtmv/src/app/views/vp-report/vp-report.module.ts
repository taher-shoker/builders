import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { VpReportRoutingModule } from './vp-report-routing.module';
import { VpReportComponent } from './vp-report.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedUiModule } from '@stc-apps/shared-ui';
import { QuillModule } from 'ngx-quill';
import { EditComponent } from './edit/edit.component';
import { PulsCardComponent } from './puls-card/puls-card.component';
import { VpSummaryCardsComponent } from './summary-cards/summary-cards.component';
import { PendingActionsPanelComponent } from './pending-actions-panel/pending-actions-panel.component';

@NgModule({
  declarations: [VpReportComponent, EditComponent, PulsCardComponent, VpSummaryCardsComponent, PendingActionsPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedUiModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSortModule,
    MatIconModule,
    VpReportRoutingModule,
    QuillModule.forRoot(), // Ensure QuillModule is imported and initialized
  ],
  exports: [PulsCardComponent, VpSummaryCardsComponent, PendingActionsPanelComponent],
  providers: [],
})
export class VpReportModule {}
