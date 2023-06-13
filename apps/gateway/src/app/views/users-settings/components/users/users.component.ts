import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'stc-apps-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  constructor(public router: Router, public route: ActivatedRoute) {}
  addNewUserLabel = 'Add New User';
  addUserNavigate(): void {
    this.router.navigate(['./add-user'], { relativeTo: this.route });
  }
}
