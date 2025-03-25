import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isScrolled = false;
  isMobileMenuOpen = false;
  isLoggedIn = false;

  showAlert = false; // Control alert visibility
  alertMessage = 'Chào mừng bạn đến với trang web!'; // Alert message
  alertType: 'success' | 'error' = 'success'; // Alert type


  constructor(private router: Router, private authService: AuthService) {} 


  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn; // Cập nhật trạng thái đăng nhập
      if (loggedIn) {
        this.showAlert = true; // Hiển thị alert khi đăng nhập thành công
        this.alertMessage = 'Đăng nhập thành công!';
        this.alertType = 'success';
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.classList.toggle('mobile-menu-open', this.isMobileMenuOpen);
  }

  navigateToLogin(): void {

    this.router.navigate(['/auth/login']);
    
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  displayAlert() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Auto close after 5 seconds
  }
}
