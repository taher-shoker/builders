import { Component, inject } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'stc-apps-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  title = 'aquila';

  constructor() {
    this.themeService.initializeTheme();
  }
}
