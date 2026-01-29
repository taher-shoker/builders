import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'stc-apps-compliance-register',
  templateUrl: './compliance-register.component.html',
  styleUrl: './compliance-register.component.scss',
})
export class ComplianceRegisterComponent implements OnInit {
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
