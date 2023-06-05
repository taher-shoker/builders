import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [RouterModule, CommonModule, TranslateModule],
  exports: [BreadcrumbComponent],
})
export class BreadCrumbModule {}
