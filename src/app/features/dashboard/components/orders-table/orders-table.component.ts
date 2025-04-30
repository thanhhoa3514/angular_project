import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Order {
  id: string;
  customer: string;
  status: 'Completed' | 'Processing' | 'Cancelled';
  date: string;
  amount: number;
}

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss']
})
export class OrdersTableComponent {
  @Input() orders: Order[] = [];
  @Input() showHeader = true;
  @Input() showViewAll = true;
  @Input() selectedOrder: Order | null = null;
  @Output() orderSelected = new EventEmitter<Order>();
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'Completed': return 'status-success';
      case 'Processing': return 'status-warning';
      case 'Cancelled': return 'status-danger';
      default: return '';
    }
  }
  
  selectOrder(order: Order): void {
    this.orderSelected.emit(order);
  }
  
  isSelected(order: Order): boolean {
    return this.selectedOrder?.id === order.id;
  }
} 