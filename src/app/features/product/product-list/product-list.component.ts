import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  
  constructor() {}
  
  ngOnInit(): void {
    // Simulate loading products from an API
    setTimeout(() => {
      this.products = [
        {
          id: 1,
          name: 'Áo Polo Nam Premium',
          price: 450000,
          originalPrice: 550000,
          discount: 18,
          image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          category: 'Áo',
          rating: 4.5
        },
        {
          id: 2,
          name: 'Quần Jeans Slim Fit',
          price: 650000,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          category: 'Quần',
          rating: 4.2
        },
        {
          id: 3,
          name: 'Áo Sơ Mi Linen',
          price: 550000,
          originalPrice: 650000,
          discount: 15,
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          category: 'Áo',
          rating: 4.8
        },
        {
          id: 4,
          name: 'Quần Kaki Slim',
          price: 450000,
          image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          category: 'Quần',
          rating: 4.0
        },
        {
          id: 5,
          name: 'Áo Thun Cotton',
          price: 250000,
          originalPrice: 300000,
          discount: 17,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          category: 'Áo',
          rating: 4.6
        },
        {
          id: 6,
          name: 'Quần Short Thể Thao',
          price: 350000,
          image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          category: 'Quần',
          rating: 4.3
        }
      ];
      this.loading = false;
    }, 800);
  }
}