import { Inject, Injectable } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { appSettings } from './lang-settings';
import { AppSettings } from './lang-settings.model';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class LanguageManagerService {
  //@Input() appSettings: AppSettings = appSettings;
  appSettings: AppSettings = appSettings;
  currentLanguageStream: BehaviorSubject<string> = new BehaviorSubject(<string>localStorage.getItem("language"))

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.init();
  }

  public getSavedLanguage() {
    return localStorage.getItem('language');
  }

  public getSavedLanguageAsStream() {
    return this.currentLanguageStream;
  }

  public setSavedLanguageAsStream(lang: 'ar' | 'en'): void {
    this.currentLanguageStream.next(lang);
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
