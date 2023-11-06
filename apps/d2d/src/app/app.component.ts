import { Component, OnInit, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageManagerService } from '@stc-apps/lng-selector';

import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ReportingService } from './services/reporting.service';

@Component({
  selector: 'stc-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'd2d';

  constructor(
    private translate: TranslateService,
    private languageManagerService: LanguageManagerService,
    private authService: AuthService,
    public router: Router,
    private _reportingService: ReportingService
  ) {

    this._reportingService.postReport('Authenticcation-Done').subscribe(() =>{console.log("init login")});

    registerLocaleData(localeAr);

    const savedLanguage =
      this.languageManagerService.getSavedLanguage() || 'en';
    this.translate.setDefaultLang('en');

    if (savedLanguage) {
      this.translate.use(savedLanguage);
    }
  }
}
