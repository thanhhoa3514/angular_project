import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service để hiển thị thông báo với UI hiện đại
 * Sử dụng CSS cho các kiểu thông báo khác nhau
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private containerElement: HTMLElement | null = null;
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        
        // Chỉ tạo container khi chạy trên browser
        if (this.isBrowser) {
            this.setupNotificationContainer();
        }
    }

    /**
     * Hiển thị thông báo thành công
     */
    showSuccess(message: string): void {
        this.showNotification(message, 'success');
    }

    /**
     * Hiển thị thông báo lỗi
     */
    showError(message: string, error?: any): void {
        if (error) {
            console.error('Error:', error);
        }
        this.showNotification(message, 'error');
    }

    /**
     * Hiển thị thông báo cảnh báo
     */
    showWarning(message: string): void {
        this.showNotification(message, 'warning');
    }

    /**
     * Hiển thị thông báo thông tin
     */
    showInfo(message: string): void {
        this.showNotification(message, 'info');
    }

    /**
     * Phương thức chung để hiển thị thông báo với kiểu được chỉ định
     */
    private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
        // Không làm gì nếu không phải môi trường browser
        if (!this.isBrowser) {
            return;
        }
        
        if (!this.containerElement) {
            this.setupNotificationContainer();
        }

        // Tạo element thông báo
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        // Thêm icon dựa trên loại thông báo
        const icon = document.createElement('span');
        icon.className = 'notification-icon';
        switch (type) {
            case 'success':
                icon.innerHTML = '✓';
                break;
            case 'error':
                icon.innerHTML = '✕';
                break;
            case 'warning':
                icon.innerHTML = '⚠';
                break;
            case 'info':
                icon.innerHTML = 'ℹ';
                break;
        }
        notification.appendChild(icon);

        // Thêm nội dung thông báo
        const content = document.createElement('span');
        content.className = 'notification-content';
        content.textContent = message;
        notification.appendChild(content);

        // Thêm nút đóng
        const closeBtn = document.createElement('span');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
        notification.appendChild(closeBtn);

        // Thêm thông báo vào container
        this.containerElement?.appendChild(notification);

        // Auto-close sau 5 giây
        setTimeout(() => {
            if (notification.parentElement) {
                this.removeNotification(notification);
            }
        }, 5000);

        // Thêm animation hiển thị
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }

    /**
     * Loại bỏ thông báo khỏi DOM với animation
     */
    private removeNotification(notification: HTMLElement): void {
        if (!this.isBrowser) {
            return;
        }
        
        notification.classList.remove('show');
        notification.classList.add('hide');

        // Đợi animation hoàn tất rồi xóa khỏi DOM
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    /**
     * Thiết lập container cho thông báo
     */
    private setupNotificationContainer(): void {
        if (!this.isBrowser) {
            return;
        }
        
        // Kiểm tra xem container đã tồn tại chưa
        const existingContainer = document.getElementById('notification-container');
        if (existingContainer) {
            this.containerElement = existingContainer;
            return;
        }

        // Tạo container mới
        this.containerElement = document.createElement('div');
        this.containerElement.id = 'notification-container';
        document.body.appendChild(this.containerElement);

        // Thêm styles
        const styles = document.createElement('style');
        styles.textContent = `
      #notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
      }
      
      .notification {
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        background-color: white;
        overflow: hidden;
      }
      
      .notification.show {
        transform: translateX(0);
        opacity: 1;
      }
      
      .notification.hide {
        transform: translateX(100%);
        opacity: 0;
      }
      
      .notification-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
      
      .notification-success {
        border-left: 4px solid #22c55e;
      }
      
      .notification-success .notification-icon {
        background-color: #22c55e;
        color: white;
      }
      
      .notification-error {
        border-left: 4px solid #ef4444;
      }
      
      .notification-error .notification-icon {
        background-color: #ef4444;
        color: white;
      }
      
      .notification-warning {
        border-left: 4px solid #f59e0b;
      }
      
      .notification-warning .notification-icon {
        background-color: #f59e0b;
        color: white;
      }
      
      .notification-info {
        border-left: 4px solid #3abff8;
      }
      
      .notification-info .notification-icon {
        background-color: #3abff8;
        color: white;
      }
      
      .notification-content {
        flex: 1;
        font-size: 14px;
        color: #333;
      }
      
      .notification-close {
        cursor: pointer;
        color: #999;
        font-size: 18px;
        transition: color 0.2s ease;
      }
      
      .notification-close:hover {
        color: #333;
      }
      
      @media (max-width: 480px) {
        #notification-container {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
        document.head.appendChild(styles);
    }
} 