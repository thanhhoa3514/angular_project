import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, OnDestroy, Renderer2, RendererFactory2, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeType = 'light' | 'dark' | 'orange-theme';

@Injectable({
    providedIn: 'root'
})
export class ThemeService implements OnDestroy {
    private renderer: Renderer2;
    private colorSchemeMediaQuery: MediaQueryList | null = null;
    private storageKey = 'theme';
    private darkThemeClass = 'dark-theme';
    private isBrowser: boolean;

    private _currentTheme = new BehaviorSubject<ThemeType>('orange-theme');
    private _sidebarState = new BehaviorSubject<boolean>(false);

    public currentTheme = this._currentTheme.asObservable();
    public sidebarState = this._sidebarState.asObservable();
    public theme$ = this._currentTheme.asObservable();

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object,
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.isBrowser = isPlatformBrowser(this.platformId);

        if (this.isBrowser) {
            // Initialize media query only in browser environment
            this.colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Apply initial theme
            this.initTheme();

            // Listen for changes in system theme
            this.colorSchemeMediaQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(newTheme, false);
                }
            });
        }

        this.loadSavedTheme();
    }

    ngOnDestroy(): void {
        if (this.isBrowser && this.colorSchemeMediaQuery) {
            this.colorSchemeMediaQuery.removeEventListener('change', () => { });
        }
    }

    toggleTheme(): void {
        const newTheme = this._currentTheme.value === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme, true);
    }

    setTheme(theme: ThemeType, storePreference = true): void {
        if (this.isBrowser) {
            if (theme === 'dark') {
                this.renderer.addClass(this.document.body, this.darkThemeClass);
            } else {
                this.renderer.removeClass(this.document.body, this.darkThemeClass);
            }

            if (storePreference) {
                localStorage.setItem(this.storageKey, theme);
            }
        }

        this._currentTheme.next(theme);
    }

    private getInitialTheme(): ThemeType {
        if (!this.isBrowser) {
            return 'light'; // Default to light theme on server
        }

        // First check for stored theme
        const storedTheme = this.getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }

        // If no stored theme, use system preference
        return this.colorSchemeMediaQuery?.matches ? 'dark' : 'light';
    }

    private getStoredTheme(): ThemeType | null {
        if (!this.isBrowser) {
            return null;
        }

        const theme = localStorage.getItem(this.storageKey) as ThemeType;
        return theme === 'light' || theme === 'dark' ? theme : null;
    }

    private initTheme(): void {
        const theme = this.getInitialTheme();
        this.setTheme(theme, false);
    }

    private loadSavedTheme(): void {
        if (!this.isBrowser) {
            return;
        }

        const theme = localStorage.getItem(this.storageKey) as ThemeType;
        if (theme) {
            this.setTheme(theme, false);
        }
    }

    toggleSidebar(): void {
        this._sidebarState.next(!this._sidebarState.value);
    }
} 