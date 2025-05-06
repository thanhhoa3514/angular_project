import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewStat } from '../../services/dashboard.service';

@Component({
  selector: 'app-review-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-progress.component.html',
  styleUrls: ['./review-progress.component.scss']
})
export class ReviewProgressComponent implements OnInit {
  @Input() title = 'Reviews';
  @Input() stats: ReviewStat[] = [];
  @Input() loading = false;
  @Input() summary = '';

  constructor() { }

  ngOnInit(): void {
  }

  // Get color for progress bar based on type
  getProgressColor(type: string): string {
    if (type.toLowerCase().includes('positive')) {
      return '#4CAF50';
    } else if (type.toLowerCase().includes('neutral')) {
      return '#FF9800';
    } else if (type.toLowerCase().includes('negative')) {
      return '#F44336';
    }
    return '#2196F3';
  }
}
