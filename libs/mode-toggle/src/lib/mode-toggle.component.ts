import { Component } from '@angular/core';
import { ModeToggleService } from './mode-toggle.service';

@Component({
  selector: 'stc-apps-mode-toggle',
  templateUrl: 'mode-toggle.component.html',
  styleUrls: ['mode-toggle.component.scss'],
  standalone : false
})
export class ModeToggleComponent {
  constructor(public modeToggleService: ModeToggleService) {}

  toggle() {
    this.modeToggleService.toggleMode();
  }
}
