import { Component, Input } from '@angular/core';

import { BannerData, BannerDataService } from './banner.service';

@Component({
  selector: 'stc-apps-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input() userName = '';
  @Input()
  pageTitle!: string;
  @Input() welcome = false;
  data!: BannerData;
  constructor(private bannerDataService: BannerDataService) {
    this.bannerDataService.data.subscribe((data) => {
      this.data = data;
    });
  }
}
