import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {} 


  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.classList.toggle('mobile-menu-open', this.isMobileMenuOpen);
  }

  navigateToLogin(): void {
    // Có thể thêm logic kiểm tra ở đây nếu cần
    this.router.navigate(['/login']);
  }
}
