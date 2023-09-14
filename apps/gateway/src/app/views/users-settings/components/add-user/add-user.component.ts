import { Component, OnInit } from '@angular/core';
import { BannerDataService } from '@stc-apps/shared-ui';
import { UsersService } from '../../users.service';

@Component({
  selector: 'stc-apps-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  constructor(
    public userService: UsersService,
    private bannerDataService: BannerDataService
  ) {}

  ngOnInit() {
    this.bannerDataService.updateData({
      title: 'add_new_user',
      text: 'add_user_txt',
    });
  }
}
