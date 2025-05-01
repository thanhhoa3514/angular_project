import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminAuthService } from '../../../../core/services/admin-auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  isSidebarExpanded = true;
  isMobileView = false;
  isMobileSidebarOpen = false;
  pageTitle = 'Dashboard';
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private adminAuthService: AdminAuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Tạm thời vô hiệu hóa kiểm tra quyền admin
      // if (!this.adminAuthService.hasAdminAccess()) {
      //   this.router.navigate(['/access-denied']);
      // }

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
        .subscribe(result => {
          this.isMobileView = result.matches;
          if (this.isMobileView) {
            this.isSidebarExpanded = false;
            this.isMobileSidebarOpen = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  toggleSidebar(): void {
    if (this.isMobileView) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    } else {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    }
  }

  onSidebarToggled(expanded: boolean): void {
    if (!this.isMobileView) {
      this.isSidebarExpanded = expanded;
    }
  }

  setPageTitle(title: string): void {
    this.pageTitle = title;
  }

  private handleResize(): void {
    if (this.isBrowser && window.innerWidth <= 640) {
      this.isSidebarExpanded = false;
      this.isMobileSidebarOpen = true;
    }
  }
} 