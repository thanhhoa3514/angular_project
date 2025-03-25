import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterLink } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AlertConfig, AlertService } from './core/services/alert.service';
import { AlertComponent } from './shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,

    HeaderComponent,
    FooterComponent,
    AlertComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'shopapp-angular';
  alert: AlertConfig | null = null;
  constructor(public router: Router,private alertService: AlertService) {}
  
  ngOnInit() {
    // Log all router events to diagnose routing issues
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation Start:', event);
      } else if (event instanceof NavigationEnd) {
        console.log('Navigation End:', event);
      } else if (event instanceof NavigationCancel) {
        console.log('Navigation Cancelled:', event);
      } else if (event instanceof NavigationError) {
        console.log('Navigation Error:', event);
      }
    });
    this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
    });
    // Log the current route configuration
    console.log('Routes configuration:', this.router.config);
  }
  onAlertClosed() {
    this.alertService.closeAlert();
  }
}