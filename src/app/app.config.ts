import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { LanguageService } from './core/services/language.service';

// NG-ZORRO
import { vi_VN, en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import en from '@angular/common/locales/en';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';

// Import các icon cụ thể
import { 
  CarOutline, 
  UndoOutline, 
  SafetyCertificateOutline, 
  CustomerServiceOutline, 
  HeartOutline, 
  ShoppingCartOutline,
  EyeOutline,
  SearchOutline,
  StarFill,
  RightOutline,
  // Iconos adicionales para la aplicación
  // MoonOutline,
  // SunOutline,
  UserOutline,
  ShoppingOutline,
  EnvironmentOutline,
  SettingOutline,
  LogoutOutline,
  DownOutline,
  MailOutline,
  PhoneOutline,
  FacebookOutline,
  TwitterOutline,
  InstagramOutline,
  YoutubeOutline,
  LinkedinOutline
} from '@ant-design/icons-angular/icons';

// Đăng ký ngôn ngữ
registerLocaleData(vi);
registerLocaleData(en);

// Language initializer function
export function initLanguage(languageService: LanguageService) {
  return () => {
    // Initialize language service
    // This will be called during app initialization
    return languageService.initLanguage();
  };
}

// Tạo danh sách icon
const icons: IconDefinition[] = [
  CarOutline, 
  UndoOutline, 
  SafetyCertificateOutline, 
  CustomerServiceOutline, 
  HeartOutline, 
  ShoppingCartOutline,
  EyeOutline,
  SearchOutline,
  StarFill,
  RightOutline,
  // Iconos adicionales
  // MoonOutline,
  // SunOutline,
  UserOutline,
  ShoppingOutline,
  EnvironmentOutline,
  SettingOutline,
  LogoutOutline,
  DownOutline,
  MailOutline,
  PhoneOutline,
  FacebookOutline,
  TwitterOutline,
  InstagramOutline,
  YoutubeOutline,
  LinkedinOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    },
    // JWT Helper Service
    { provide: JwtHelperService, useFactory: () => new JwtHelperService() },
    // Language service initialization
    {
      provide: APP_INITIALIZER,
      useFactory: initLanguage,
      deps: [LanguageService],
      multi: true
    },
    // NG-ZORRO providers
    provideNzI18n(vi_VN),
    importProvidersFrom(NzIconModule.forRoot(icons))
  ]
};
