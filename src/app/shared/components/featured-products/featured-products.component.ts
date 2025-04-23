import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  ratingCount: number;
  sold: number;
  category: string;
  slug: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isOutOfStock?: boolean;
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    NzRateModule,
    NzToolTipModule,
    NzMessageModule,
    NzBadgeModule
  ],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Áo thun nam cổ tròn',
      price: 249000,
      originalPrice: 399000,
      discount: 38,
      image: 'assets/images/products/product1.jpg',
      rating: 4.5,
      ratingCount: 120,
      sold: 320,
      category: 'Thời trang nam',
      slug: 'ao-thun-nam-co-tron',
      isFeatured: true
    },
    {
      id: 2,
      name: 'Đầm xòe nữ họa tiết hoa',
      price: 499000,
      originalPrice: 699000,
      discount: 29,
      image: 'assets/images/products/product2.jpg',
      rating: 4.8,
      ratingCount: 86,
      sold: 190,
      category: 'Thời trang nữ',
      slug: 'dam-xoe-nu-hoa-tiet-hoa',
      isFeatured: true
    },
    {
      id: 3,
      name: 'Điện thoại Samsung Galaxy S23',
      price: 15990000,
      originalPrice: 18990000,
      discount: 16,
      image: 'assets/images/products/product3.jpg',
      rating: 4.9,
      ratingCount: 235,
      sold: 430,
      category: 'Điện thoại & Máy tính bảng',
      slug: 'dien-thoai-samsung-galaxy-s23',
      isFeatured: true
    },
    {
      id: 4,
      name: 'Laptop Dell XPS 13',
      price: 28990000,
      originalPrice: 32990000,
      discount: 12,
      image: 'assets/images/products/product4.jpg',
      rating: 4.7,
      ratingCount: 78,
      sold: 110,
      category: 'Laptop & Máy tính',
      slug: 'laptop-dell-xps-13',
      isFeatured: true
    },
    {
      id: 5,
      name: 'Đồng hồ thông minh Apple Watch Series 8',
      price: 10990000,
      originalPrice: 12990000,
      discount: 15,
      image: 'assets/images/products/product5.jpg',
      rating: 4.6,
      ratingCount: 64,
      sold: 85,
      category: 'Đồng hồ',
      slug: 'dong-ho-thong-minh-apple-watch-series-8',
      isFeatured: true,
      isNew: true
    },
    {
      id: 6,
      name: 'Giày thể thao Nike Air Max',
      price: 2990000,
      originalPrice: 3490000,
      discount: 14,
      image: 'assets/images/products/product6.jpg',
      rating: 4.8,
      ratingCount: 112,
      sold: 250,
      category: 'Giày dép',
      slug: 'giay-the-thao-nike-air-max',
      isFeatured: true
    },
    {
      id: 7,
      name: 'Túi xách nữ thời trang',
      price: 799000,
      originalPrice: 1290000,
      discount: 38,
      image: 'assets/images/products/product7.jpg',
      rating: 4.7,
      ratingCount: 53,
      sold: 120,
      category: 'Thời trang nữ',
      slug: 'tui-xach-nu-thoi-trang',
      isFeatured: true
    },
    {
      id: 8,
      name: 'Tai nghe Bluetooth Sony WH-1000XM5',
      price: 7990000,
      originalPrice: 8990000,
      discount: 11,
      image: 'assets/images/products/product8.jpg',
      rating: 4.9,
      ratingCount: 87,
      sold: 150,
      category: 'Phụ kiện điện thoại',
      slug: 'tai-nghe-bluetooth-sony-wh-1000xm5',
      isFeatured: true,
      isNew: true
    }
  ];
  
  constructor(private messageService: NzMessageService) {}
  
  addToCart(product: Product): void {
    this.messageService.success(`Đã thêm ${product.name} vào giỏ hàng`);
  }
  
  addToWishlist(product: Product): void {
    this.messageService.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
  }
  
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
} 