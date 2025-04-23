import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// NG-ZORRO
import { vi_VN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
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
  RightOutline
} from '@ant-design/icons-angular/icons';

// Đăng ký ngôn ngữ
registerLocaleData(vi);

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
  RightOutline
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
    // NG-ZORRO providers
    provideNzI18n(vi_VN),
    importProvidersFrom(NzIconModule.forRoot(icons))
  ]
};
