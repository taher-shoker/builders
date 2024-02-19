import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageManagerService } from '@stc-apps/lng-selector';

import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { AppInitService } from './services/app-init.service';

@Component({
  selector: 'stc-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'dtmv';

  constructor(
    private translate: TranslateService,
    private languageManagerService: LanguageManagerService,
   private appInitService: AppInitService
  ) {
    registerLocaleData(localeAr);


    this.appInitService.Init();

    const savedLanguage =
      this.languageManagerService.getSavedLanguage() || 'en';
    this.translate.setDefaultLang('en');


    if (savedLanguage) {
      this.translate.use(savedLanguage);
    }
  }

  ngOnInit(): void {
    this.translate.use('en');
      
  }
}
