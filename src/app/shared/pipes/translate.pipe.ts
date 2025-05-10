import { Pipe, PipeTransform } from '@angular/core';
import { APP_TRANSLATIONS } from '../../core/constants/language.constants';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
    name: 'translate',
    pure: false, // Make it impure to update when language changes
    standalone: true
})
export class TranslatePipe implements PipeTransform {

    constructor(private languageService: LanguageService) { }

    transform(key: string, params?: Record<string, string>): string {
        const currentLang = this.languageService.getCurrentLanguage();
        const translations = APP_TRANSLATIONS[currentLang];

        if (!translations || !translations[key]) {
            // Fallback to key if translation not found
            console.warn(`Translation key not found: ${key}`);
            return key;
        }

        let translatedText = translations[key];

        // Replace parameters if provided
        if (params) {
            Object.keys(params).forEach(paramKey => {
                translatedText = translatedText.replace(`{{${paramKey}}}`, params[paramKey]);
            });
        }

        return translatedText;
    }
} 