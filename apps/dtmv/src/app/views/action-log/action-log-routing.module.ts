import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from '../../services/admin.auth.guard';
import { ActionLogComponent } from './action-log.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminAuthGuard],
    component: ActionLogComponent,
    data: { breadcrumb: 'Action Log' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionLogRoutingModule {}
