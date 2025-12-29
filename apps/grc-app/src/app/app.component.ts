import { Component, OnInit } from '@angular/core';
import { AuthService } from './services';

@Component({
  selector: 'stc-apps-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserData();
  }
}
