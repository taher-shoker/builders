import { Component, Input } from '@angular/core';

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
}
