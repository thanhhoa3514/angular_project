import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../core/services/alert.service';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product: any = {};
  selectedSize: string = 'M';
  selectedColor: string = '#0066cc';
  quantity: number = 1;
  isLoading: boolean = true;
  mainImage: string = '';
  thumbnails: string[] = [];
  private ApiUrl=environment.apiUrl;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Lấy id sản phẩm từ URL
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(productId);
    }
  }

  loadProductDetails(productId: string): void {
    
    this.isLoading = true;
    // Gọi API để lấy thông tin sản phẩm
    this.http.get(`${this.ApiUrl}/api/v1/products/${productId}`).subscribe({
      next: (data: any) => {
        this.product = data;
        this.mainImage = data.thumbnail || 'https://via.placeholder.com/600x400';
        this.thumbnails = data.productImages?.map((img: any) => img.image_url) || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.alertService.error('Không thể tải thông tin sản phẩm');
        this.isLoading = false;
      }
    });
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  changeQuantity(change: number): void {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && newQuantity <= this.product.quantity) {
      this.quantity = newQuantity;
    }
  }

  setMainImage(imageUrl: string): void {
    this.mainImage = imageUrl;
  }

  addToCart(): void {
    const item = {
      productId: this.product.id,
      quantity: this.quantity,
      color: this.selectedColor,
      size: this.selectedSize,
      price: this.product.discount_price || this.product.price,
      name: this.product.name,
      thumbnail: this.mainImage
    };
    
    this.cartService.addToCart(item).subscribe({
      next: () => {
        this.alertService.success('Đã thêm sản phẩm vào giỏ hàng');
      },
      error: (error:any) => {
        console.error('Error adding to cart:', error);
        this.alertService.error('Không thể thêm vào giỏ hàng');
      }
    });
  }
  onQuantityChange(event: any): void {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= this.product.quantity) {
      this.quantity = value;
    } else if (value < 1) {
      this.quantity = 1;
    } else if (value > this.product.quantity) {
      this.quantity = this.product.quantity;
    }
  }
  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }
}