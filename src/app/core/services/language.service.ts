import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { en_US, vi_VN, NzI18nService } from 'ng-zorro-antd/i18n';
import { isPlatformBrowser } from '@angular/common';

export type SupportedLanguage = 'vi' | 'en';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    // Default language
    private readonly DEFAULT_LANG: SupportedLanguage = 'vi';
    private readonly LANG_STORAGE_KEY = 'app_language';
    private isBrowser: boolean;

    // BehaviorSubject to track the current language
    private currentLangSubject = new BehaviorSubject<SupportedLanguage>(this.DEFAULT_LANG);

    // Observable for components to subscribe to
    public currentLang$: Observable<SupportedLanguage> = this.currentLangSubject.asObservable();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private nzI18nService: NzI18nService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        // Initialize language automatically when service is created
        this.initLanguage();
    }

    public initLanguage(): void {
        // Try to get language from URL query params
        this.activatedRoute.queryParams.subscribe(params => {
            const langParam = params['lang'] as SupportedLanguage;

            if (langParam && this.isValidLanguage(langParam)) {
                this.setLanguage(langParam, false); 
                return;
            }

 
            if (this.isBrowser) {
                const storedLang = localStorage.getItem(this.LANG_STORAGE_KEY) as SupportedLanguage;
                if (storedLang && this.isValidLanguage(storedLang)) {
                    this.setLanguage(storedLang, false); 
                    return;
                }
            }
            
            // Default to Vietnamese if nothing is set
            this.setLanguage(this.DEFAULT_LANG, false); 
        });
    }

    /**
     * Get the current language
     */
    getCurrentLanguage(): SupportedLanguage {
        return this.currentLangSubject.value;
    }

    /**
     * Set application language
     * @param lang The language to set
     * @param updateUrl Whether to update the URL with the language parameter
     */
    setLanguage(lang: SupportedLanguage, updateUrl: boolean = true): void {
        if (!this.isValidLanguage(lang)) {
            lang = this.DEFAULT_LANG;
        }

        // Save to localStorage (only in browser)
        if (this.isBrowser) {
            localStorage.setItem(this.LANG_STORAGE_KEY, lang);
        }

        // Update the observable
        this.currentLangSubject.next(lang);

        // Sync with NG-ZORRO locale
        this.syncNgZorroLocale(lang);

        // Update URL if needed and if we're not during app initialization
        if (updateUrl && this.isBrowser) {
            this.updateUrlWithLang(lang);
        }
    }

    /**
     * Toggle between available languages
     */
    toggleLanguage(): void {
        const currentLang = this.getCurrentLanguage();
        const newLang: SupportedLanguage = currentLang === 'vi' ? 'en' : 'vi';
        this.setLanguage(newLang, true);
    }

    /**
     * Sync the NG-ZORRO locale with the current language
     */
    private syncNgZorroLocale(lang: SupportedLanguage): void {
        switch (lang) {
            case 'en':
                this.nzI18nService.setLocale(en_US);
                break;
            case 'vi':
            default:
                this.nzI18nService.setLocale(vi_VN);
                break;
        }
    }

    /**
     * Add or update the lang parameter in the current URL
     */
    private updateUrlWithLang(lang: SupportedLanguage): void {
        try {
            // Use location instead of router to avoid navigation
            const url = this.location.path();
            const urlTree = this.router.parseUrl(url);
            
            // Update existing query params
            urlTree.queryParams = { ...urlTree.queryParams, lang };
            
            // Convert to string and update location without navigating
            const newUrl = urlTree.toString();
            this.location.replaceState(newUrl);
        } catch (error) {
            console.error('Error updating URL with language parameter:', error);
        }
    }

    /**
     * Check if the language is valid
     */
    private isValidLanguage(lang: string): boolean {
        return ['vi', 'en'].includes(lang);
    }
} 