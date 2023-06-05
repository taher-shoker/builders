import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LanguageManagerService } from '@stc-apps/lng-selector';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@Component({
  selector: 'stc-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gateway';

  constructor(
    private translate: TranslateService,
    private languageManagerService: LanguageManagerService
  ) {
    const savedLanguage =
      this.languageManagerService.getSavedLanguage() || 'en';
    this.translate.setDefaultLang('en');

    if (savedLanguage) {
      this.translate.use(savedLanguage);
    }
  }
}
