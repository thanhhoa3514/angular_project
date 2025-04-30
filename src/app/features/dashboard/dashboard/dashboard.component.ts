import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatsCardComponent } from '../components/stats-card/stats-card.component';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { ReviewProgressComponent } from '../components/review-progress/review-progress.component';
import { DataTableComponent } from '../components/data-table/data-table.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { DashboardService, StatCard, ChartData, ReviewStat, Product } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatsCardComponent,
    BarChartComponent,
    ReviewProgressComponent,
    DataTableComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pageTitle = 'Dashboard';
  
  // Sidebar control
  isSidebarExpanded = true;
  isMobileView = false;
  isMobileSidebarOpen = false;
  
  // Loading states
  statsLoading = true;
  chartLoading = true;
  reviewsLoading = true;
  productsLoading = true;
  
  // Stats cards data
  statsCards: StatCard[] = [];
  
  // Chart data
  quarterlyData: ChartData | null = null;
  
  // Reviews stats
  reviewStats: ReviewStat[] = [];
  reviewSummary = 'More than 1,500,000 developers used Creative Tim\'s products and over 700,000 projects were created.';
  
  // Products data
  topProducts: Product[] = [];
  
  // Browser detection
  isBrowser: boolean;

  constructor(
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Always load data to ensure it's available for both server and client rendering
    this.loadDashboardData();
    
    // Check for mobile view on init
    if (this.isBrowser) {
      this.checkScreenSize();
      window.addEventListener('resize', this.checkScreenSize.bind(this));
    }
  }
  
  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.checkScreenSize.bind(this));
    }
  }

  loadDashboardData(): void {
    // Load statistics
    this.dashboardService.getStatistics().subscribe({
      next: (data) => {
        this.statsCards = data;
        this.statsLoading = false;
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.statsLoading = false;
      }
    });

    // Load quarterly data
    this.dashboardService.getQuarterlyData().subscribe({
      next: (data) => {
        this.quarterlyData = data;
        this.chartLoading = false;
      },
      error: (err) => {
        console.error('Error loading quarterly data:', err);
        this.chartLoading = false;
      }
    });

    // Load review stats
    this.dashboardService.getReviewStats().subscribe({
      next: (data) => {
        this.reviewStats = data;
        this.reviewsLoading = false;
      },
      error: (err) => {
        console.error('Error loading review stats:', err);
        this.reviewsLoading = false;
      }
    });

    // Load top products
    this.dashboardService.getTopProducts().subscribe({
      next: (data) => {
        this.topProducts = data;
        this.productsLoading = false;
      },
      error: (err) => {
        console.error('Error loading top products:', err);
        this.productsLoading = false;
      }
    });
  }
  
  toggleSidebar(): void {
    if (this.isMobileView) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    } else {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    }
  }
  
  onSidebarToggled(expanded: boolean): void {
    this.isSidebarExpanded = expanded;
  }
  
  private checkScreenSize(): void {
    if (window.innerWidth <= 768) {
      this.isMobileView = true;
      this.isSidebarExpanded = false;
    } else {
      this.isMobileView = false;
      this.isMobileSidebarOpen = false;
    }
  }
}
