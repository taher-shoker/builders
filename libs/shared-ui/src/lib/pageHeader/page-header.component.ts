import { Component, input } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'stc-apps-page-header',
  standalone: false,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  mainTitle = input.required<string>();
  username = input.required<string>();
  secondaryTitle = input<string>();
  isDeletedProject = input<boolean>(false);
  fontFamilies = input.required<string[]>();
  constructor(private location: Location) {}
  returnBack() {
    this.location.back();
  }
}
