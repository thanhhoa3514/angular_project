import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  pageTitle = 'Dashboard Overview';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  onToggleSidebar(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  onMobileMenuToggle(): void {
    if (this.isBrowser && window.innerWidth <= 640) {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  private handleResize(): void {
    if (this.isBrowser && window.innerWidth <= 640) {
      this.sidebarCollapsed = true;
    }
  }
}
