import { Component, ElementRef, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ChartData } from '../../services/dashboard.service';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() chartData: ChartData | null = null;
  @Input() chartTitle = '';
  @Input() loading = false;

  private chart: Chart | null = null;
  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Only initialize chart if in browser environment
    if (this.isBrowser) {
      this.initializeChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser && changes['chartData'] && this.chartData && this.chart) {
      this.updateChart();
    }
  }

  private initializeChart(): void {
    // Only proceed if in browser environment
    if (!this.isBrowser) return;

    // Wait for view to initialize
    setTimeout(() => {
      if (this.chartCanvas && this.chartData) {
        const ctx = this.chartCanvas.nativeElement.getContext('2d');
        if (ctx) {
          try {
            this.chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: this.chartData.labels,
                datasets: this.chartData.datasets
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 15,
                      padding: 15
                    }
                  },
                  title: {
                    display: this.chartTitle !== '',
                    text: this.chartTitle,
                    font: {
                      size: 16
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }
            });
          } catch (error) {
            console.error('Error initializing chart:', error);
          }
        }
      }
    }, 0);
  }

  private updateChart(): void {
    if (!this.isBrowser) return;
    
    if (this.chart && this.chartData) {
      try {
        this.chart.data.labels = this.chartData.labels;
        this.chart.data.datasets = this.chartData.datasets;
        this.chart.update();
      } catch (error) {
        console.error('Error updating chart:', error);
      }
    }
  }
}
