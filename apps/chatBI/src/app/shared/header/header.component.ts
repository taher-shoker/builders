import { Location } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title: InputSignal<string> = input('');
  constructor(private location: Location, private router: Router) {}
  goBack() {
    setTimeout(() => {
      this.location.back();
    }, 300);
    // this.router.navigate(['/startChat'])
  }
}
