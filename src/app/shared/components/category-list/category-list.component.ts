import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  image: string;
  slug: string;
}

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzGridModule,
    NzIconModule
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  categories: Category[] = [
    {
      id: 1,
      name: 'Thời trang nam',
      description: 'Áo, quần, giày dép và phụ kiện thời trang cho nam giới',
      icon: 'man',
      image: 'assets/images/categories/men.jpg',
      slug: 'thoi-trang-nam'
    },
    {
      id: 2,
      name: 'Thời trang nữ',
      description: 'Đầm, áo, quần, giày dép và phụ kiện thời trang cho nữ giới',
      icon: 'woman',
      image: 'assets/images/categories/women.jpg',
      slug: 'thoi-trang-nu'
    },
    {
      id: 3,
      name: 'Điện thoại & Máy tính bảng',
      description: 'Các loại điện thoại thông minh và máy tính bảng',
      icon: 'mobile',
      image: 'assets/images/categories/mobile.jpg',
      slug: 'dien-thoai-may-tinh-bang'
    },
    {
      id: 4,
      name: 'Laptop & Máy tính',
      description: 'Laptop và các loại máy tính, phụ kiện tin học',
      icon: 'laptop',
      image: 'assets/images/categories/laptop.jpg',
      slug: 'laptop-may-tinh'
    },
    {
      id: 5,
      name: 'Đồng hồ',
      description: 'Đồng hồ thời trang và đồng hồ thông minh',
      icon: 'clock-circle',
      image: 'assets/images/categories/watches.jpg',
      slug: 'dong-ho'
    },
    {
      id: 6,
      name: 'Giày dép',
      description: 'Các loại giày, dép thời trang và thể thao',
      icon: 'skin',
      image: 'assets/images/categories/shoes.jpg',
      slug: 'giay-dep'
    }
  ];
} 