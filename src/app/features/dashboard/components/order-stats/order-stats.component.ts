import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrderStats {
  completed: number;
  processing: number;
  cancelled: number;
  total: number;
}

@Component({
  selector: 'app-order-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-stats.component.html',
  styleUrls: ['./order-stats.component.scss']
})
export class OrderStatsComponent {
  @Input() stats: OrderStats = {
    completed: 0,
    processing: 0,
    cancelled: 0,
    total: 0
  };
  
  getCompletedPercentage(): number {
    return this.stats.total ? Math.round((this.stats.completed / this.stats.total) * 100) : 0;
  }
  
  getProcessingPercentage(): number {
    return this.stats.total ? Math.round((this.stats.processing / this.stats.total) * 100) : 0;
  }
  
  getCancelledPercentage(): number {
    return this.stats.total ? Math.round((this.stats.cancelled / this.stats.total) * 100) : 0;
  }
} 