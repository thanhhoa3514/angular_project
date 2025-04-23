import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';

// Import shared components for home page
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { CategoryListComponent } from '../../shared/components/category-list/category-list.component';
import { FeaturedProductsComponent } from '../../shared/components/featured-products/featured-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    NzButtonModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzDividerModule,
    BannerComponent,
    CategoryListComponent,
    FeaturedProductsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      title: 'Mua sắm dễ dàng',
      description: 'Trải nghiệm mua sắm trực tuyến đơn giản, nhanh chóng và tiện lợi',
      icon: 'shopping',
      image: 'assets/images/undraw_online-shopping_hgf6.svg'
    },
    {
      title: 'Thanh toán an toàn',
      description: 'Đa dạng phương thức thanh toán với bảo mật cao',
      icon: 'credit-card',
      image: 'assets/images/undraw_credit-card-payment_3zqz.svg'
    },
    {
      title: 'Giao hàng tận nơi',
      description: 'Giao hàng nhanh chóng đến tận nhà trên toàn quốc',
      icon: 'car',
      image: 'assets/images/undraw_deliveries_2m9t.svg'
    },
    {
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn mọi lúc',
      icon: 'customer-service',
      image: 'assets/images/undraw_conversation_15p8.svg'
    }
  ];
  
  categories = [
    { name: 'Thời trang nam', path: '/products/category/thoi-trang-nam' },
    { name: 'Thời trang nữ', path: '/products/category/thoi-trang-nu' },
    { name: 'Đồng hồ', path: '/products/category/dong-ho' },
    { name: 'Giày dép', path: '/products/category/giay-dep' },
    { name: 'Phụ kiện', path: '/products/category/phu-kien' },
    { name: 'Điện thoại', path: '/products/category/dien-thoai' }
  ];
}
