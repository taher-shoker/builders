import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { BreadcrumbService } from './breadcrumb.sevices';
import { Breadcrumb } from './breadcrumb.model';

@Component({
  selector: 'stc-apps-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private router: Router
  ) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }
}
