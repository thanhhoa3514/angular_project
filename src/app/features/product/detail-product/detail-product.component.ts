import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../core/services/alert.service';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../core/models/product.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CartItem } from '../../../core/models/cart.model';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

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
export class DetailProductComponent implements OnInit, AfterViewInit {
  product: any = {};
  selectedSize: string = 'M';
  selectedColor: string = '#0066cc';
  quantity: number = 1;
  isLoading: boolean = true;
  mainImage: string = '';
  thumbnails: string[] = [];
  relatedProducts: any[] = [];
  reviews: any[] = [];
  averageRating: number = 0;
  isInWishlist: boolean = false;
  zoomLevel: number = 1;
  isZoomed: boolean = false;
  loadingRelated: boolean = false;
  
  @ViewChild('zoomContainer') zoomContainer?: ElementRef;
  
  private ApiUrl=environment.apiUrl;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private cartService: CartService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    // Lấy id sản phẩm từ URL
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(productId);
    }
  }
  
  ngAfterViewInit(): void {
    // Initialize zoom functionality after view is initialized
    if (this.zoomContainer) {
      this.initZoom();
    }
  }
  
  initZoom(): void {
    const element = this.zoomContainer?.nativeElement;
    if (element) {
      element.addEventListener('mousemove', (e: MouseEvent) => {
        if (!this.isZoomed) return;
        
        const { left, top, width, height } = element.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        element.style.transformOrigin = `${x * 100}% ${y * 100}%`;
      });
    }
  }
  
  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
    if (this.zoomContainer) {
      if (this.isZoomed) {
        this.zoomContainer.nativeElement.style.transform = `scale(2.5)`;
      } else {
        this.zoomContainer.nativeElement.style.transform = 'scale(1)';
      }
    }
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    
    // Fetch product, related products, and reviews
    const product$ = this.http.get<Product>(`${this.ApiUrl}/api/v1/products/${productId}`);
    const relatedProducts$ = this.http.get<any[]>(`${this.ApiUrl}/api/v1/products/related/${productId}`).pipe(
      catchError(() => of([]))
    );
    const reviews$ = this.http.get<any[]>(`${this.ApiUrl}/api/v1/reviews/product/${productId}`).pipe(
      catchError(() => of([]))
    );
    const wishlist$ = this.checkWishlistStatus(productId).pipe(
      catchError(() => of(false))
    );
    
    forkJoin({
      product: product$,
      related: relatedProducts$,
      reviews: reviews$,
      wishlist: wishlist$
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (results) => {
        this.product = results.product;
        this.mainImage = results.product.thumbnail || 'https://via.placeholder.com/600x400';
        this.thumbnails = results.product.productImages?.map((img: any) => img.image_url) || [];
        this.relatedProducts = results.related.slice(0, 4);
        this.reviews = results.reviews;
        this.isInWishlist = results.wishlist;
        
        // Calculate average rating
        if (this.reviews.length > 0) {
          this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.alertService.error('Không thể tải thông tin sản phẩm');
      }
    });
  }
  
  checkWishlistStatus(productId: string): Observable<boolean> {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }
    
    return this.http.get<boolean>(`${this.ApiUrl}/api/v1/wishlist/check/${productId}`);
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
    // Reset zoom when changing image
    this.isZoomed = false;
    if (this.zoomContainer) {
      this.zoomContainer.nativeElement.style.transform = 'scale(1)';
    }
  }

  addToCart(): void {
    const item: CartItem = {
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
      error: (error) => {
        this.errorHandler.handleError(error, 'Add to cart');
      }
    });
  }
  
  toggleWishlist(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    if (this.isInWishlist) {
      this.http.delete(`${this.ApiUrl}/api/v1/wishlist/remove/${this.product.id}`).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.alertService.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
        },
        error: (error) => {
          this.errorHandler.handleError(error, 'Remove from wishlist');
        }
      });
    } else {
      this.http.post(`${this.ApiUrl}/api/v1/wishlist/add`, { productId: this.product.id }).subscribe({
        next: () => {
          this.isInWishlist = true;
          this.alertService.success('Đã thêm sản phẩm vào danh sách yêu thích');
        },
        error: (error) => {
          this.errorHandler.handleError(error, 'Add to wishlist');
        }
      });
    }
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
  
  viewRelatedProduct(productId: string): void {
    // Navigate to the product detail page with smooth scroll to top
    this.router.navigate(['/products', productId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return [
      ...Array(fullStars).fill(1),
      ...(hasHalfStar ? [0.5] : []),
      ...Array(emptyStars).fill(0)
    ];
  }
}