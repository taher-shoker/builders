import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  breadcrumbs: string[] = [];
  constructor(private router: Router) {
    this.handleBreadcrumbs();
  }

  handleBreadcrumbs() {
    const url = this.router.routerState.snapshot.url;
    const urlSegments = url.split('/');

    // Remove query parameters from the last segment
    let lastSegment = urlSegments[urlSegments.length - 1];
    lastSegment = lastSegment.split('?')[0];
    urlSegments[urlSegments.length - 1] = lastSegment;

    let combinedSegments = [];
    for (let i = 0; i < urlSegments.length; i++) {
      combinedSegments.push(urlSegments[i]);
    }

    this.breadcrumbs = combinedSegments
      .filter((segment) => segment && segment.trim().length > 0)
      .map((segment) => {
        const decodedSegment = decodeURIComponent(segment);

        return `${decodedSegment.replace(/[^a-zA-Z0-9&-_\/\-\:\s]/g, '')}`;
      })
      .filter((segment) => segment.length > 0);
  }

  generateBreadcrumbUrl(index: number): string {
    return '/' + this.breadcrumbs.slice(0, index + 1).join('/');
  }
}
