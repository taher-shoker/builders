import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';

const routes: Routes = [
  {
    // path: '',
    // component: CassesSettingComponent,
    // data: { breadcrumb: '' },

    // children: [
    //   {
    //     path: '',
    //     component: CassesComponent,
    //   },
    //   {
    //     path: 'add-case',
    //     component: AddCasseComponent,
    //     data: { breadcrumb: 'Add new Case' },
    //   },
    //   {
    //     path: 'case-details/:id',
    //     component: CasseDetailsComponent,
    //     data: { breadcrumb: `case-details` },
    //   },
    // ],

    path:"",
    component: AdministrationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
