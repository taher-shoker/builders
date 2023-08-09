import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { appSettings } from './lang-settings';
import { AppSettings } from './lang-settings.model';
import { LanguageManagerService } from './language-manager.service';

@Component({
  selector: 'stc-apps-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
  public appSettings: AppSettings = appSettings;
  public currentLang: string | null =
    this.languageManagerService.getSavedLanguage();

  constructor(
    private translate: TranslateService,
    private languageManagerService: LanguageManagerService
  ) {}

  public changeLanguage(languageCode: 'ar' | 'en') {
    this.translate.use(languageCode);
    this.currentLang = languageCode;
    this.languageManagerService.saveLanguage(languageCode);
    this.languageManagerService.setSavedLanguageAsStream(languageCode)
  }
}
