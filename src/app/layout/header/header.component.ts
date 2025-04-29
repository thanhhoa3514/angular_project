import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

// Importamos los iconos necesarios
import {
  MoonOutline,
  SunOutline,
  UserOutline,
  ShoppingOutline,
  EnvironmentOutline,
  SettingOutline,
  LogoutOutline,
  DownOutline,
  ShoppingCartOutline,
  SearchOutline
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
    NzSwitchModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories = [
    { name: 'Home', path: '/' },
    { name: 'Sản phẩm', path: '/products' },
    { name: 'Giới thiệu', path: '/about' },
    { name: 'Liên hệ', path: '/contact' }
  ];
  
  searchValue = '';
  isLoggedIn = false;
  currentUser: User | null = null;
  currentTheme: ThemeType = 'light';
  
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private themeService = inject(ThemeService);
  private destroy$ = new Subject<void>();
  
  constructor() {
    // Registro de iconos
    const iconList = [
      MoonOutline,
      SunOutline,
      UserOutline,
      ShoppingOutline,
      EnvironmentOutline,
      SettingOutline,
      LogoutOutline,
      DownOutline,
      ShoppingCartOutline,
      SearchOutline
    ];
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
} 