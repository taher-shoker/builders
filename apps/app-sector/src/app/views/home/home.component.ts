import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  scoreCardName = window.history.state.scoreCardName;
  constructor() {
    console.log('name', this.scoreCardName);
  }
}
