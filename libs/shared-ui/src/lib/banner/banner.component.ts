import { Component, Input } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.sevices';
import { Observable } from 'rxjs';

import { Breadcrumb } from '../breadcrumb/breadcrumb.model';

@Component({
  selector: 'stc-apps-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input() userName = '';
  @Input({ required: true })
  pageTitle!: string;
  @Input() welcome = false;

  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}
