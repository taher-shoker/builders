import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageManagerService } from './language-manager.service';
import { AppSettings } from './app-settings.model';
import { appSettings } from './app.settings';

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

  public changeLanguage(languageCode: string) {
    this.translate.use(languageCode);
    this.currentLang = languageCode;
    this.languageManagerService.saveLanguage(languageCode);
  }
}
