import {Language} from './language.model';

export interface AppSettings {
  defaultLanguage: Language;
  languages: Language[];
}
