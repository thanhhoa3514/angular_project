import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../../../core/services/notification.service';

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
  @Output() statusChanged = new EventEmitter<{orderId: string, newStatus: string}>();
  
  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

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
  
  changeStatusOrder(event: Event, order: Order): void {
    // Ngăn chặn sự kiện click lan truyền để không trigger selectOrder
    event.stopPropagation();
    
    // Lấy trạng thái tiếp theo
    const nextStatus = this.getNextStatus(order.status);
    
    // Cập nhật trạng thái
    this.orderService.updateOrderStatus(order.id, nextStatus as any).subscribe({
      next: () => {
        // Cập nhật UI
        order.status = nextStatus as any;
        // Emit sự kiện để parent component biết
        this.statusChanged.emit({orderId: order.id, newStatus: nextStatus});
        // Hiển thị thông báo
        this.notificationService.showSuccess(`Order #${order.id} status updated to ${nextStatus}`);
      },
      error: (error) => {
        this.notificationService.showError(`Failed to update order status`, error);
      }
    });
  }
  
  // Phương thức chuyển đổi trạng thái theo thứ tự: Processing -> Completed -> Cancelled -> Processing
  getNextStatus(currentStatus: string): string {
    switch(currentStatus) {
      case 'Processing': return 'Completed';
      case 'Completed': return 'Cancelled';
      case 'Cancelled': return 'Processing';
      default: return 'Processing';
    }
  }
} 