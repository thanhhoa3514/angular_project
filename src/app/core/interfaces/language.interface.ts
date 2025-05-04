import { SupportedLanguage } from '../services/language.service';

export interface TranslationObject {
  [key: string]: string;
}

export interface LanguageTranslations {
  vi: TranslationObject;
  en: TranslationObject;
} 