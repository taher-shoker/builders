import { AppSettings } from './lang-settings.model';
import { Language } from './language.model';

const defaultLanguage: Language = {
  code: 'en',
  key: 'english',
  dir: 'ltr',
};

export const appSettings: AppSettings = {
  defaultLanguage: defaultLanguage,
  languages: [
    defaultLanguage,
    {
      code: 'ar',
      key: 'arabic',
      dir: 'rtl',
    },
  ],
};
