import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCarouselModule,
    NzButtonModule
  ],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  banners: Banner[] = [
    {
      id: 1,
      title: 'Flash Sale Cuối Tuần',
      subtitle: 'Giảm đến 50% cho tất cả sản phẩm thời trang',
      image: 'assets/images/banner1.jpg',
      buttonText: 'Mua ngay',
      buttonLink: '/products/sale'
    },
    {
      id: 2,
      title: 'Bộ Sưu Tập Mới',
      subtitle: 'Khám phá xu hướng thời trang mùa hè 2025',
      image: 'assets/images/banner2.jpg',
      buttonText: 'Xem ngay',
      buttonLink: '/products/new'
    },
    {
      id: 3,
      title: 'Miễn Phí Vận Chuyển',
      subtitle: 'Cho tất cả đơn hàng trên 500.000đ',
      image: 'assets/images/banner3.jpg',
      buttonText: 'Tìm hiểu thêm',
      buttonLink: '/shipping'
    }
  ];
  
  effect = 'scrollx';
  
  carouselOptions = {
    autoPlay: true,
    dots: true,
    autoPlaySpeed: 5000
  };
} 