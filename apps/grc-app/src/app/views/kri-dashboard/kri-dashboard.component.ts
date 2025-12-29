import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'stc-apps-kri-dashboard',
  templateUrl: './kri-dashboard.component.html',
  styleUrl: './kri-dashboard.component.scss',
})
export class KriDashboardComponent implements OnInit {
  userName!: string;

  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.loggedUserStream.subscribe((user) => {
      if (user) {
        this.userName = user.name;
      }
    });
  }
}
