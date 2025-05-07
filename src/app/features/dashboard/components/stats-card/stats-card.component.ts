import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCard } from '../../services/dashboard.service';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {
  @Input() data: StatCard | null = null;
  @Input() loading = false;

  constructor() {}

  ngOnInit(): void {}

  // Format large numbers with commas (e.g., 1000 -> 1,000)
  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Get class based on whether percentage is positive or negative
  getPercentageClass(): string {
    if (!this.data) return '';
    return this.data.percentage > 0 ? 'positive' : 'negative';
  }

  // Get icon for percentage trend
  getTrendIcon(): string {
    if (!this.data) return '';
    return this.data.percentage > 0 ? 'trending_up' : 'trending_down';
  }
}
