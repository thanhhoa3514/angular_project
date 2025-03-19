import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterLink } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'shopapp-angular';
  
  constructor(public router: Router) {}
  
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
    
    // Log the current route configuration
    console.log('Routes configuration:', this.router.config);
  }
}