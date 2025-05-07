import { Injectable } from "@angular/core";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Order, OrderStatus } from "../models/order.model";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    // BehaviorSubject để lưu trữ và phát ra các đơn hàng hiện tại
    private ordersSubject = new BehaviorSubject<Order[]>([]);
    public orders$ = this.ordersSubject.asObservable();


    // BehaviorSubject để lưu trữ và phát ra đơn hàng được chọn
    private selectedOrderSubject = new BehaviorSubject<Order | null>(null);
    public selectedOrder$ = this.selectedOrderSubject.asObservable();


    // BehaviorSubject để theo dõi trạng thái tải
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();


    // BehaviorSubject để lưu trữ thống kê đơn hàng
    private orderStatsSubject = new BehaviorSubject<any>(null);
    public orderStats$ = this.orderStatsSubject.asObservable();

    constructor(private http: HttpClient) {

    }

    getOrders(filters?: any): Observable<Order[]> {
        this.loadingSubject.next(true);

        // Xây dựng query parameters từ các bộ lọc
        let queryParams = '';
        if (filters) {
            const params = [];
            for (const key in filters) {
                if (filters[key]) {
                    params.push(`${key}=${encodeURIComponent(filters[key])}`);
                }
            }
            if (params.length > 0) {
                queryParams = `?${params.join('&')}`;
            }
        }

        return this.http.get<Order[]>(`${this.apiUrl}${queryParams}`).pipe(
            tap(orders => {
                this.ordersSubject.next(orders);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                this.loadingSubject.next(false);
                return this.handleError('Failed to fetch orders', error);
            })
        );
    }

    // Lấy chi tiết một đơn hàng
    getOrderById(id: string): Observable<Order> {
        this.loadingSubject.next(true);

        return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
            tap(order => {
                this.selectedOrderSubject.next(order);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                this.loadingSubject.next(false);
                return this.handleError(`Failed to fetch order #${id}`, error);
            })
        );
    }

    // Cập nhật một đơn hàng
    updateOrder(order: Order): Observable<Order> {
        this.loadingSubject.next(true);

        return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order).pipe(
            tap(updatedOrder => {
                // Cập nhật đơn hàng trong danh sách hiện tại
                const currentOrders = this.ordersSubject.value;
                const index = currentOrders.findIndex(o => o.id === updatedOrder.id);

                if (index !== -1) {
                    const updatedOrders = [...currentOrders];
                    updatedOrders[index] = updatedOrder;
                    this.ordersSubject.next(updatedOrders);
                }

                // Cập nhật đơn hàng được chọn nếu đang được xem
                if (this.selectedOrderSubject.value?.id === updatedOrder.id) {
                    this.selectedOrderSubject.next(updatedOrder);
                }

                this.loadingSubject.next(false);

                // Làm mới thống kê đơn hàng nếu trạng thái thay đổi
                this.getOrderStats();
            }),
            catchError(error => {
                this.loadingSubject.next(false);
                return this.handleError(`Failed to update order #${order.id}`, error);
            })
        );
    }

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
        this.loadingSubject.next(true);

        return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, { status }).pipe(
            tap(updatedOrder => {
                // Cập nhật đơn hàng trong danh sách hiện tại
                const currentOrders = this.ordersSubject.value;
                const index = currentOrders.findIndex(o => o.id === orderId);

                if (index !== -1) {
                    const updatedOrders = [...currentOrders];
                    updatedOrders[index] = updatedOrder;
                    this.ordersSubject.next(updatedOrders);
                }

                // Cập nhật đơn hàng được chọn nếu đang được xem
                if (this.selectedOrderSubject.value?.id === orderId) {
                    this.selectedOrderSubject.next(updatedOrder);
                }

                this.loadingSubject.next(false);

                // Làm mới thống kê đơn hàng
                this.getOrderStats();
            }),
            catchError(error => {
                this.loadingSubject.next(false);
                return this.handleError(`Failed to update status for order #${orderId}`, error);
            })
        );
    }

    // Chọn đơn hàng để xem chi tiết
    selectOrder(order: Order | null) {
        this.selectedOrderSubject.next(order);
    }

    // Xuất đơn hàng ra Excel
    exportOrdersToExcel(filters?: any): Observable<Blob> {
        // Xây dựng query parameters từ các bộ lọc
        let queryParams = '';
        if (filters) {
            const params = [];
            for (const key in filters) {
                if (filters[key]) {
                    params.push(`${key}=${encodeURIComponent(filters[key])}`);
                }
            }
            if (params.length > 0) {
                queryParams = `?${params.join('&')}`;
            }
        }

        return this.http.get(`${this.apiUrl}/export${queryParams}`, {
            responseType: 'blob'
        }).pipe(
            catchError(error => this.handleError('Failed to export orders', error))
        );
    }

    // Lấy thống kê đơn hàng
    getOrderStats(period: string = 'week'): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats?period=${period}`).pipe(
            tap(stats => {
                this.orderStatsSubject.next(stats);
            }),
            catchError(error => this.handleError('Failed to fetch order statistics', error))
        );
    }

    // Xử lý lỗi
    private handleError(operation: string, error: any): Observable<never> {
        console.error(`${operation}:`, error);

        let errorMessage = 'An unknown error occurred';
        if (error.error instanceof ErrorEvent) {
            // Lỗi client-side
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Lỗi từ backend
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        // Có thể thêm thông báo lỗi thông qua service thông báo ở đây

        return throwError(() => new Error(errorMessage));
    }

}