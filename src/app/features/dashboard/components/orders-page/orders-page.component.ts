import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OrdersTableComponent, Order as OrderTableComponent } from '../orders-table/orders-table.component';
import { OrderAccessComponent } from '../order-access/order-access.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderStatsComponent } from '../order-stats/order-stats.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ExportService } from '../../services/export.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { Order as OrderModel, OrderStatus } from '../../models/order.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OrdersTableComponent,
    OrderStatsComponent,
    OrderDetailComponent,
    OrderAccessComponent,
    SidebarComponent
  ],
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent implements OnInit, OnDestroy {

  // Biến tìm kiếm
  searchQuery: string = '';
  
  // Subscriptions để hủy khi component bị hủy
  private subscriptions = new Subscription();
  // Order stats data matching OrderStats interface
  orderStats = {
    completed: 118,
    processing: 23,
    cancelled: 15,
    total: 156
  };
  // Form lọc
  filterForm: FormGroup;
  // Biến theo dõi trạng thái loading
  isLoading = false;

  // Phân trang
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  totalOrders = 0;
  // Order data matching Order interface
  orders: OrderTableComponent[] = [
    {
      id: 'ORD-001',
      customer: 'Nguyễn Văn A',
      date: '2023-10-28',
      status: 'Completed',
      amount: 256.50
    },
    {
      id: 'ORD-002',
      customer: 'Trần Thị B',
      date: '2023-10-27',
      status: 'Processing',
      amount: 142.75
    },
    {
      id: 'ORD-003',
      customer: 'Lê Văn C',
      date: '2023-10-26',
      status: 'Cancelled',
      amount: 89.99
    },
    {
      id: 'ORD-004',
      customer: 'Phạm Thị D',
      date: '2023-10-25',
      status: 'Completed',
      amount: 320.00
    }
  ];

  // Order detail data
  selectedOrder: OrderTableComponent | null = null;
  showOrderDetail = false;

  constructor(
    private exportService: ExportService, 
    private fb: FormBuilder, 
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      dateRange: ['last30'],
      paymentMethod: ['']
    });
  }

  ngOnInit(): void {
    // Đăng ký các observable
    this.subscribeToOrderService();

    this.subscriptions.add(
      this.filterForm.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() => {
        this.currentPage = 1; // Reset trang khi thay đổi bộ lọc
        this.loadOrders();
      })
    );

    // Tải đơn hàng ban đầu
    this.loadOrders();
    
    // Tải thống kê đơn hàng
    this.loadOrderStats('week');
  }
  
  ngOnDestroy(): void {
    // Hủy tất cả subscriptions để tránh memory leak
    this.subscriptions.unsubscribe();
  }
  
  // Xử lý khi chọn một order từ bảng
  onOrderSelected(order: OrderTableComponent): void {
    this.selectedOrder = order;
    this.showOrderDetail = true;
  }

  // Xử lý khi thay đổi trạng thái order
  onStatusChanged(event: {orderId: string, newStatus: string}): void {
    // Cập nhật thống kê
    this.updateOrderStats(event.newStatus);
    
    // Nếu order này đang được chọn, cập nhật selectedOrder
    if (this.selectedOrder && this.selectedOrder.id === event.orderId) {
      this.selectedOrder = {
        ...this.selectedOrder,
        status: event.newStatus as any
      };
    }
    
    // Cập nhật order trong danh sách
    const orderIndex = this.orders.findIndex(o => o.id === event.orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        status: event.newStatus as any
      };
    }
  }
  
  // Cập nhật thống kê khi thay đổi trạng thái
  private updateOrderStats(newStatus: string): void {
    // Giảm số lượng của trạng thái cũ
    const oldStatus = this.findOldStatus(newStatus);
    if (oldStatus && this.orderStats[oldStatus.toLowerCase() as keyof typeof this.orderStats] > 0) {
      (this.orderStats[oldStatus.toLowerCase() as keyof typeof this.orderStats] as number)--;
    }
    
    // Tăng số lượng của trạng thái mới
    (this.orderStats[newStatus.toLowerCase() as keyof typeof this.orderStats] as number)++;
  }
  
  // Tìm trạng thái cũ dựa vào trạng thái mới
  private findOldStatus(newStatus: string): string {
    switch(newStatus) {
      case 'Completed': return 'Processing';
      case 'Cancelled': return 'Completed';
      case 'Processing': return 'Cancelled';
      default: return '';
    }
  }

  // Xuất danh sách đơn hàng ra file
  exportOrders(): void {
    const fileName = `orders-export-${new Date().toISOString().split('T')[0]}`;
    this.exportService.exportToExcel(this.orders, fileName);
    this.notificationService.showSuccess('Orders exported successfully');
  }

  // Đăng ký các observable từ OrderService
  private subscribeToOrderService(): void {
    // Đăng ký theo dõi trạng thái loading
    this.subscriptions.add(
      this.orderService.loading$.subscribe(
        loading => this.isLoading = loading
      )
    );

    // Đăng ký theo dõi đơn hàng được chọn
    this.subscriptions.add(
      this.orderService.selectedOrder$.subscribe(
        order => {
          if (order) {
            // Convert từ Order model sang OrderTableComponent để phù hợp với TableComponent
            this.selectedOrder = this.convertToOrderTableComponent(order);
            this.showOrderDetail = true;
          } else {
            this.selectedOrder = null;
            this.showOrderDetail = false;
          }
        }
      )
    );

    // Đăng ký theo dõi thống kê đơn hàng
    this.subscriptions.add(
      this.orderService.orderStats$.subscribe(
        stats => {
          if (stats) {
            this.orderStats = stats;
          }
        }
      )
    );
  }

  // Chuyển đổi từ Order model sang OrderTableComponent
  private convertToOrderTableComponent(order: OrderModel): OrderTableComponent {
    return {
      id: order.id,
      customer: order.customer.name,
      status: order.status as any, // Ép kiểu tạm thời
      date: order.date,
      amount: order.total
    };
  }

  // Tải danh sách đơn hàng với các bộ lọc
  loadOrders(): void {
    const filters = {
      ...this.filterForm.value,
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchQuery
    };


        // Must be implement in the backend side
    // this.subscriptions.add(
    //   this.orderService.getOrders(filters).subscribe({
    //     next: (response: any) => {
    //       // Chuyển đổi từ Order model sang OrderTableComponent
    //       this.orders = response.data.map((order: OrderModel) => this.convertToOrderTableComponent(order));
    //       this.totalOrders = response.total;
    //       this.totalPages = Math.ceil(response.total / this.pageSize);
    //     },
    //     error: (error) => {
    //       this.notificationService.showError('Failed to load orders', error);
    //     }
    //   })
    // );
  }

  // Tải thống kê đơn hàng
  loadOrderStats(period: string): void {

      // Must be implement in the backend side

    // this.subscriptions.add(
    //   this.orderService.getOrderStats(period).subscribe({
    //     error: (error) => {
    //       this.notificationService.showError('Failed to load order statistics', error);
    //     }
    //   })
    // );
  }

  // // Xử lý khi chọn một đơn hàng
  // onOrderSelected(order: Order): void {
  //   if (this.selectedOrder && this.selectedOrder.id === order.id) {
  //     // Nếu đã chọn đơn hàng này rồi, hủy chọn
  //     this.orderService.selectOrder(null);
  //   } else {
  //     // Nếu chưa, tải chi tiết đơn hàng
  //     this.orderService.getOrderById(order.id).subscribe({
  //       error: (error) => {
  //         this.notificationService.showError(`Failed to load order details for #${order.id}`, error);
  //       }
  //     });
  //   }
  // }

  // Đóng chi tiết đơn hàng
  closeOrderDetail(): void {
    this.orderService.selectOrder(null);
  }

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Order #${orderId} status updated successfully`);
      },
      error: (error) => {
        this.notificationService.showError(`Failed to update order status`, error);
      }
    });
  }

  // Tìm kiếm đơn hàng
  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1; // Reset trang khi tìm kiếm
    this.loadOrders();
  }

  // Chuyển trang
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  // Trang trước
  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Trang sau
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Xóa tất cả bộ lọc
  clearAllFilters(): void {
    this.filterForm.reset({
      status: '',
      dateRange: 'last30',
      paymentMethod: ''
    });
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadOrders();
    this.notificationService.showInfo('All filters have been cleared');
  }

  // Xuất đơn hàng ra Excel
  exportOrdersByFilter(): void {
    const filters = {
      ...this.filterForm.value,
      search: this.searchQuery
    };
    
    this.orderService.exportOrdersToExcel(filters).subscribe({
      next: (blob: Blob) => {
        // Tạo URL tạm thời cho blob
        const url = window.URL.createObjectURL(blob);
        
        // Tạo thẻ a để tải xuống
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        
        // Dọn dẹp
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.notificationService.showSuccess('Orders exported successfully');
      },
      error: (error) => {
        this.notificationService.showError('Failed to export orders', error);
      }
    });
  }

  // Thay đổi khoảng thời gian cho thống kê
  onStatsPeriodChange(event: any): void {
    const period = event.target.value;
    this.loadOrderStats(period);
    this.notificationService.showInfo(`Statistics updated for ${period} period`);
  }
} 