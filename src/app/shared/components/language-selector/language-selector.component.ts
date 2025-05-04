import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguageService, SupportedLanguage } from '../../../core/services/language.service';
import { NgZorroModule } from '../../ng-zorro.module';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.scss'],
    standalone: true,
    imports: [CommonModule, NgZorroModule, TranslatePipe, NzDropDownModule, NzButtonModule, NzIconModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LanguageSelectorComponent implements OnInit {
    currentLanguage: SupportedLanguage = 'vi';

    constructor(private languageService: LanguageService) { }

    ngOnInit(): void {
        // Get initial language
        this.currentLanguage = this.languageService.getCurrentLanguage();

        // Subscribe to language changes
        this.languageService.currentLang$.subscribe(lang => {
            this.currentLanguage = lang;
        });
    }

    // Change language
    changeLanguage(lang: SupportedLanguage): void {
        this.languageService.setLanguage(lang);
    }

    // Toggle between Vietnamese and English
    toggleLanguage(): void {
        this.languageService.toggleLanguage();
    }
} 