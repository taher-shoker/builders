import { Component, OnInit } from '@angular/core';
import { BannerDataService } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-add-casse',
  templateUrl: './add-casse.component.html',
  styleUrls: ['./add-casse.component.scss'],
})
export class AddCasseComponent implements OnInit {
  constructor(private bannerDataService: BannerDataService) {}
  ngOnInit(): void {
    this.bannerDataService.updateData({
      title: 'Add new Case',
      text: 'Please add actual data and be sure to add all required data',
    });
  }
}
