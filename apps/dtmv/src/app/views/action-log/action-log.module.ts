import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActionLogRoutingModule } from './action-log-routing.module';
import { ActionLogComponent } from './action-log.component';

@NgModule({
  declarations: [ActionLogComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    ActionLogRoutingModule,
  ],
  exports: [],
  providers: [],
})
export class ActionLogModule {}

