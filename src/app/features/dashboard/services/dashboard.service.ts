import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface StatCard {
  title: string;
  value: number;
  icon: string;
  percentage: number;
  color: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth?: number;
  }[];
}

export interface ReviewStat {
  type: string;
  percentage: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  // Get statistics cards data
  getStatistics(): Observable<StatCard[]> {
    // In a real app, you would fetch from API
    // return this.http.get<StatCard[]>(`${this.apiUrl}/statistics`);
    
    // For now, return mock data
    return of([
      {
        title: 'Users Active',
        value: 3000,
        icon: 'person',
        percentage: 55,
        color: '#FFB84C'
      },
      {
        title: 'Likes',
        value: 940,
        icon: 'thumb_up',
        percentage: 90,
        color: '#333333'
      },
      {
        title: 'Purchases',
        value: 1024,
        icon: 'shopping_cart',
        percentage: 10,
        color: '#333333'
      },
      {
        title: 'Dislikes',
        value: 19,
        icon: 'thumb_down',
        percentage: 12,
        color: '#333333'
      }
    ]);
  }

  // Get quarter sales comparison data
  getQuarterlyData(): Observable<ChartData> {
    // return this.http.get<ChartData>(`${this.apiUrl}/quarterly`);
    
    return of({
      labels: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
      datasets: [
        {
          label: 'Target Sales',
          data: [65, 59, 80, 81],
          backgroundColor: '#FF6B6B',
          borderColor: '#FF6B6B'
        },
        {
          label: 'Reality Sales',
          data: [45, 70, 65, 85],
          backgroundColor: '#FFD166',
          borderColor: '#FFD166'
        }
      ]
    });
  }

  // Get product reviews statistics
  getReviewStats(): Observable<ReviewStat[]> {
    // return this.http.get<ReviewStat[]>(`${this.apiUrl}/reviews`);
    
    return of([
      { type: 'Positive Review', percentage: 75 },
      { type: 'Neutral Reviews', percentage: 60 },
      { type: 'Negative Reviews', percentage: 40 }
    ]);
  }

  // Get top products
  getTopProducts(): Observable<Product[]> {
    // return this.http.get<Product[]>(`${this.apiUrl}/top-products`);
    
    return of([
      { id: 1, name: 'Product 1', category: 'Category 1', price: 14000, status: 'active' },
      { id: 2, name: 'Product 1', category: 'Category 1', price: 14000, status: 'active' },
      { id: 3, name: 'Product 1', category: 'Category 1', price: 14000, status: 'active' },
      { id: 4, name: 'Product 1', category: 'Category 1', price: 14000, status: 'active' },
      { id: 5, name: 'Product 1', category: 'Category 1', price: 14000, status: 'active' },
      { id: 6, name: 'Product 1', category: 'Category 1', price: 14000, status: 'active' }
    ]);
  }
}
