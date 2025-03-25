import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ProductVariant {
  color: string;
  size?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

export interface OrderSummary {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  
  getCartItems(): Observable<CartItem[]> {
    // Trong thực tế, dữ liệu này sẽ được lấy từ API hoặc localStorage
    const items = [
      {
        product: {
          id: 1,
          name: 'Áo Polo Nam Premium',
          price: 450000,
          originalPrice: 550000,
          thumbnail: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        quantity: 2,
        variant: {
          color: 'Xanh Navy',
          size: 'L'
        }
      },
      {
        product: {
          id: 2,
          name: 'Quần Jeans Slim Fit',
          price: 650000,
          thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        quantity: 1,
        variant: {
          color: 'Xanh đậm',
          size: '32'
        }
      }
    ];
    return of(items);
  }

  calculateTotals(items: CartItem[], discount: number, shipping: number): { subtotal: number, total: number } {
    const subtotal = items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const total = subtotal - discount + shipping;
    return { subtotal, total };
  }

  applyPromoCode(code: string, subtotal: number): { discount: number, shipping: number, message: string } {
    let discount = 0;
    let shipping = 30000;
    let message = '';

    if (code.toUpperCase() === 'SALE10') {
      discount = subtotal * 0.1; // Giảm 10%
      message = 'Áp dụng mã giảm giá thành công! Bạn được giảm 10%';
    } else if (code.toUpperCase() === 'FREESHIP') {
      shipping = 0;
      message = 'Áp dụng mã giảm giá thành công! Bạn được miễn phí vận chuyển';
    } else {
      message = 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
    }

    return { discount, shipping, message };
  }

  validateShippingInfo(address: ShippingAddress): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    
    if (!address.fullName) {
      errors['fullName'] = 'Vui lòng nhập họ và tên';
    }
    
    if (!address.phone) {
      errors['phone'] = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(address.phone)) {
      errors['phone'] = 'Số điện thoại không hợp lệ';
    }
    
    if (!address.email) {
      errors['email'] = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      errors['email'] = 'Email không hợp lệ';
    }
    
    if (!address.address) {
      errors['address'] = 'Vui lòng nhập địa chỉ';
    }
    
    return errors;
  }

  placeOrder(orderData: OrderSummary): Observable<boolean> {
    // Trong thực tế, gửi dữ liệu đơn hàng lên server
    console.log('Đặt hàng với thông tin:', orderData);
    
    // Giả lập API call thành công
    return of(true);
  }
}