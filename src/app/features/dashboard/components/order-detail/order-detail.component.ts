import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../orders-table/orders-table.component';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {
  @Input() order: Order | null = null;
  
  orderItems: OrderItem[] = [
    {
      id: 'PROD-001',
      name: 'Smartphone X Pro',
      price: 799.99,
      quantity: 1,
      total: 799.99
    },
    {
      id: 'PROD-002',
      name: 'Wireless Earbuds',
      price: 129.99,
      quantity: 1,
      total: 129.99
    },
    {
      id: 'PROD-003',
      name: 'Phone Case',
      price: 24.99,
      quantity: 1,
      total: 24.99
    }
  ];
  
  getSubtotal(): number {
    return this.orderItems.reduce((total, item) => total + item.total, 0);
  }
  
  getShipping(): number {
    return 15.00;
  }
  
  getTax(): number {
    return this.getSubtotal() * 0.1; // 10% tax
  }
  
  getTotal(): number {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'Completed': return 'status-success';
      case 'Processing': return 'status-warning';
      case 'Cancelled': return 'status-danger';
      default: return '';
    }
  }
} 