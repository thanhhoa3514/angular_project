import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

interface ProductVariant {
  color: string;
  size?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  discount: number = 0;
  shipping: number = 30000; // 30,000 VND
  total: number = 0;
  promoCode: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Mô phỏng dữ liệu giỏ hàng
    this.cartItems = [
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
      },
      {
        product: {
          id: 3,
          name: 'Giày Sneaker Thể Thao',
          price: 1250000,
          originalPrice: 1450000,
          thumbnail: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        quantity: 1,
        variant: {
          color: 'Trắng',
          size: '42'
        }
      }
    ];

    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    this.total = this.subtotal - this.discount + this.shipping;
  }

  increaseQuantity(item: CartItem) {
    if (item.quantity < 99) {
      item.quantity++;
      this.calculateTotals();
    }
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotals();
    }
  }

  updateQuantity(item: CartItem, event: any) {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0 && value <= 99) {
      item.quantity = value;
    } else {
      item.quantity = 1;
      event.target.value = 1;
    }
    this.calculateTotals();
  }

  removeItem(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.calculateTotals();
    }
  }

  clearCart() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      this.cartItems = [];
      this.calculateTotals();
    }
  }

  applyPromoCode() {
    if (this.promoCode.toUpperCase() === 'SALE10') {
      this.discount = this.subtotal * 0.1; // Giảm 10%
      alert('Áp dụng mã giảm giá thành công! Bạn được giảm 10%');
    } else if (this.promoCode.toUpperCase() === 'FREESHIP') {
      this.shipping = 0;
      this.discount = 0;
      alert('Áp dụng mã giảm giá thành công! Bạn được miễn phí vận chuyển');
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      this.discount = 0;
      this.shipping = 30000;
    }
    this.calculateTotals();
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
