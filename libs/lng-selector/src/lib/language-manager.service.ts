import { Inject, Injectable } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { appSettings } from './lang-settings';
import { AppSettings } from './lang-settings.model';

@Injectable({
  providedIn: 'root',
})
export class LanguageManagerService {
  //@Input() appSettings: AppSettings = appSettings;
  appSettings: AppSettings = appSettings;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.init();
  }

  public getSavedLanguage() {
    return localStorage.getItem('language');
  }

  public saveLanguage(languageCode: string) {
    localStorage.setItem('language', languageCode);
    this.addDirection(languageCode);
  }

  public addDirection(languageCode: string | null) {
    const htmlElement = this.document.querySelector('[dir]');
    if (languageCode === 'ar') {
      htmlElement?.setAttribute('dir', 'rtl');
    } else {
      htmlElement?.setAttribute('dir', 'ltr');
    }
  }
  private init() {
    if (!this.getSavedLanguage()) {
      this.saveLanguage(appSettings.defaultLanguage.code);
    } else {
      this.addDirection(this.getSavedLanguage());
    }
  }
}
