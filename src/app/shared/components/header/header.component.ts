import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isCollapsed: boolean = false;
  currentTheme: string = '';
  notificationCount: number = 3;
  userName: string = 'John Doe';
  
  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.currentTheme.subscribe(theme => {
      this.currentTheme = theme;
    });
    
    this.themeService.sidebarState.subscribe(state => {
      this.isCollapsed = state;
    });
  }

  toggleSidebar(): void {
    this.themeService.toggleSidebar();
  }
} 