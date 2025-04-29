import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersTableComponent, Order } from '../orders-table/orders-table.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, OrdersTableComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  recentOrders: Order[] = [];

  ngOnInit(): void {
    // In a real application, this would come from a service
    this.recentOrders = [
      {
        id: '#ORD-001',
        customer: 'John Smith',
        status: 'Completed',
        date: 'Apr 28, 2025',
        amount: 120.00
      },
      {
        id: '#ORD-002',
        customer: 'Sarah Johnson',
        status: 'Processing',
        date: 'Apr 27, 2025',
        amount: 85.50
      },
      {
        id: '#ORD-003',
        customer: 'Michael Brown',
        status: 'Cancelled',
        date: 'Apr 26, 2025',
        amount: 210.75
      },
      {
        id: '#ORD-004',
        customer: 'Emily Wilson',
        status: 'Completed',
        date: 'Apr 25, 2025',
        amount: 150.25
      }
    ];
  }
} 