import { Location } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title: InputSignal<string> = input('');
  constructor(private location: Location) {}
  goBack() {
    setTimeout(() => {
      this.location.back();
    }, 300);
  }
}
