import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../users.service';
import { BannerDataService } from '@stc-apps/shared-ui';
import { User } from '../../../../shared/models/users-settings.model';

@Component({
  selector: 'stc-apps-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  userId!: string;
  userData!: User;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public userService: UsersService,
    private bannerDataService: BannerDataService
  ) {}

  getUser(id: string) {
    this.userService.getUser(id).subscribe((res: User) => {
      this.userData = res;
    });
  }
  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.getUser(this.userId);
    this.bannerDataService.updateData({ title: '', text: '' });
  }
}
