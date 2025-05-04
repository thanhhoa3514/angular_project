import { Component, OnInit, OnDestroy, inject, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService, User } from '../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService, ThemeType } from '../../core/services/theme.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { LanguageService, SupportedLanguage } from '../../core/services/language.service';

import {
  UserOutline,
  ShoppingOutline,
  EnvironmentOutline,
  SettingOutline,
  LogoutOutline,
  DownOutline,
  ShoppingCartOutline,
  SearchOutline,
  GlobalOutline,
  MenuOutline,
  CloseOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputModule,
    NzIconModule,
    NzBadgeModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    NzToolTipModule,
    NzSwitchModule,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories = [
    { name: 'nav.home', path: '/' },
    { name: 'nav.products', path: '/products' },
    { name: 'nav.about', path: '/about' },
    { name: 'nav.contact', path: '/contact' }
  ];
  
  searchValue = '';
  isLoggedIn = false;
  currentUser: User | null = null;
  currentTheme: ThemeType = 'light';
  isCompactMode = false;
  isMobileMenuOpen = false;
  private isBrowser: boolean;
  
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private themeService = inject(ThemeService);
  public languageService = inject(LanguageService);
  private destroy$ = new Subject<void>();
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isBrowser) {
      this.checkScreenWidth();
    }
  }
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if running in browser
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Register all icons that will be used
    const iconList = [
      UserOutline,
      ShoppingOutline,
      EnvironmentOutline,
      SettingOutline,
      LogoutOutline,
      DownOutline,
      ShoppingCartOutline,
      SearchOutline,
      GlobalOutline,
      MenuOutline,
      CloseOutline
    ];
    
    // Check screen width initially (only in browser)
    if (this.isBrowser) {
      this.checkScreenWidth();
    } else {
      // Default for server-side rendering
      this.isCompactMode = false;
    }
  }
  
  private checkScreenWidth() {
    if (this.isBrowser) {
      this.isCompactMode = window.innerWidth < 768;
    }
  }
  
  ngOnInit(): void {
    // Theo dõi trạng thái đăng nhập
    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });
    
    // Theo dõi thông tin người dùng hiện tại
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
      
    // Theo dõi theme hiện tại
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  get cartItemCount(): number {
    return this.cartService.getCartItemCount();
  }
  
  onSearch(): void {
    console.log('Tìm kiếm:', this.searchValue);
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  // Lấy chữ cái đầu tiên của tên người dùng để hiển thị trong avatar
  get userInitial(): string {
    return this.currentUser?.fullName.charAt(0).toUpperCase() || 'U';
  }
  
  // Chuyển đổi theme sáng/tối
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  // Kiểm tra nếu theme hiện tại là dark mode
  get isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }
  
  // Mobile menu functions
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
  
  // Get current language
  getCurrentLanguage(): SupportedLanguage {
    return this.languageService.getCurrentLanguage();
  }
} 