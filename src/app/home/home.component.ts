import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../alert/alert.component';
interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  discount?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showAlert = false; // Biến để điều khiển hiển thị alert
  alertMessage = 'Chào mừng bạn đến với trang web!'; // Thông điệp alert
  alertType: 'success' | 'error' = 'success'; 


  displayAlert() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Tự động đóng alert sau 5 giây
  }
  constructor() {} 
  products: Product[] = [
    {
      id: 1,
      name: 'Áo thun cao cấp chất lượng',
      price: 80000,
      oldPrice: 100000,
      image: 'https://images.pexels.com/photos/5614114/pexels-photo-5614114.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Thời trang',
      rating: 4.5,
      discount: 20
    },
    {
      id: 2,
      name: 'Quần jean nam skinny fit',
      price: 250000,
      oldPrice: 350000,
      image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Thời trang',
      rating: 4.2,
      discount: 29
    },
    {
      id: 3,
      name: 'Giày thể thao nữ',
      price: 450000,
      oldPrice: 550000,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Giày dép',
      rating: 4.7,
      discount: 18
    },
    {
      id: 4,
      name: 'Túi xách thời trang',
      price: 320000,
      oldPrice: 400000,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Phụ kiện',
      rating: 4.3,
      discount: 20
    },
    {
      id: 5,
      name: 'Đồng hồ thông minh',
      price: 1200000,
      oldPrice: 1500000,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Điện tử',
      rating: 4.8,
      discount: 20
    },
    {
      id: 6,
      name: 'Tai nghe bluetooth',
      price: 350000,
      oldPrice: 500000,
      image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Điện tử',
      rating: 4.6,
      discount: 30
    },
    {
      id: 7,
      name: 'Váy dài thời trang',
      price: 280000,
      oldPrice: 350000,
      image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Thời trang',
      rating: 4.4,
      discount: 20
    },
    {
      id: 8,
      name: 'Áo khoác denim nam',
      price: 420000,
      oldPrice: 500000,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Thời trang',
      rating: 4.5,
      discount: 16
    }
  ];
  
  categories = [
    { name: 'Thời trang', icon: 'fas fa-tshirt' },
    { name: 'Điện thoại', icon: 'fas fa-mobile-alt' },
    { name: 'Máy tính', icon: 'fas fa-laptop' },
    { name: 'Phụ kiện', icon: 'fas fa-headphones' }
  ];


  
  ngOnInit(): void {
    // Component initialization
  }

  // Format price to VND
  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + '₫';
  }
  // navigateToLogin(): void {
  //   this.router.navigate(['/login']);
  // }
}
