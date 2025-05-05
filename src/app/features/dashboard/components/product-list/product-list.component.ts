import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  category_id: number;
  status: 'active' | 'low' | 'inactive';
}

interface ProductStats {
  total: number;
  totalGrowth: number;
  sold: number;
  soldGrowth: number;
  revenue: string;
  revenueGrowth: number;
  customers: number;
  customerGrowth: number;
}

interface Activity {
  id: number;
  user: string;
  type: 'added' | 'updated' | 'deleted';
  target: string;
  time: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  productStats: ProductStats = {
    total: 248,
    totalGrowth: 12,
    sold: 1463,
    soldGrowth: 8.7,
    revenue: '1.25 Tỷ',
    revenueGrowth: 23.5,
    customers: 842,
    customerGrowth: -3.2,
  };

  recentActivities: Activity[] = [];
  showProductForm = false;
  showProductDetails = false;
  selectedProduct: Product | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadRecentActivities();
  }

  private loadProducts(): void {
    // In a real app, this would be fetched from an API
    this.products = [
      {
        id: 1,
        name: 'Smartphone X1',
        description: 'Smartphone cao cấp với tính năng đột phá',
        price: 9990000,
        quantity: 124,
        thumbnail: 'assets/images/smartphone.jpg',
        created_at: '2023-10-15',
        updated_at: '2023-11-20',
        category_id: 1,
        status: 'active'
      },
      {
        id: 2,
        name: 'Laptop Pro',
        description: 'Laptop mạnh mẽ cho công việc chuyên nghiệp',
        price: 22490000,
        quantity: 42,
        thumbnail: 'assets/images/laptop.jpg',
        created_at: '2023-09-10',
        updated_at: '2023-11-18',
        category_id: 1,
        status: 'active'
      },
      {
        id: 3,
        name: 'Smart Watch',
        description: 'Đồng hồ thông minh theo dõi sức khỏe',
        price: 3690000,
        quantity: 8,
        thumbnail: 'assets/images/smartwatch.jpg',
        created_at: '2023-11-05',
        updated_at: '2023-11-15',
        category_id: 2,
        status: 'low'
      },
      {
        id: 4,
        name: 'Màn hình 27"',
        description: 'Màn hình UHD 4K cho chất lượng hình ảnh sắc nét',
        price: 5490000,
        quantity: 0,
        thumbnail: 'assets/images/monitor.jpg',
        created_at: '2023-08-20',
        updated_at: '2023-11-10',
        category_id: 3,
        status: 'inactive'
      },
      {
        id: 5,
        name: 'Tai nghe không dây',
        description: 'Tai nghe bluetooth với âm thanh chất lượng cao',
        price: 2490000,
        quantity: 53,
        thumbnail: 'assets/images/headphones.jpg',
        created_at: '2023-10-25',
        updated_at: '2023-11-12',
        category_id: 4,
        status: 'active'
      }
    ];

    this.filteredProducts = [...this.products];
  }

  private loadRecentActivities(): void {
    // In a real app, this would be fetched from an API
    this.recentActivities = [
      {
        id: 1,
        user: 'Nguyễn Hoàng',
        type: 'added',
        target: 'sản phẩm mới <strong>Smart Watch</strong>',
        time: '30 phút trước'
      },
      {
        id: 2,
        user: 'Trần Minh',
        type: 'updated',
        target: 'giá sản phẩm <strong>Laptop Pro</strong>',
        time: '2 giờ trước'
      },
      {
        id: 3,
        user: 'Lê Thị Hương',
        type: 'deleted',
        target: 'sản phẩm <strong>Tai nghe có dây</strong>',
        time: '1 ngày trước'
      },
      {
        id: 4,
        user: 'Phạm Văn Đức',
        type: 'updated',
        target: 'tồn kho cho <strong>5 sản phẩm</strong>',
        time: '2 ngày trước'
      },
      {
        id: 5,
        user: 'Nguyễn Hoàng',
        type: 'added',
        target: 'danh mục mới <strong>Phụ kiện</strong>',
        time: '3 ngày trước'
      }
    ];
  }

  searchProducts(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    if (!searchTerm) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  openAddProductModal(): void {
    this.selectedProduct = null;
    this.showProductForm = true;
    this.showProductDetails = false;
  }

  openProductDetails(product: Product): void {
    this.selectedProduct = product;
    this.showProductDetails = true;
    this.showProductForm = false;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.showProductForm = true;
    this.showProductDetails = false;
  }

  deleteProduct(product: Product): void {
    // This would show a confirmation dialog before deleting
    console.log('Delete product', product);
  }

  closeModal(): void {
    this.showProductForm = false;
    this.showProductDetails = false;
    this.selectedProduct = null;
  }

  saveProduct(product: Product): void {
    if (this.selectedProduct) {
      // Update existing product
      const index = this.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.products[index] = { ...product };
      }
    } else {
      // Add new product
      const newId = Math.max(...this.products.map(p => p.id)) + 1;
      const newProduct = {
        ...product,
        id: newId,
        created_at: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString().slice(0, 10),
        status: product.quantity > 10 ? 'active' : product.quantity > 0 ? 'low' : 'inactive' as any
      };
      this.products.push(newProduct);
    }
    this.filteredProducts = [...this.products];
    this.closeModal();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'low': return 'Sắp hết';
      case 'inactive': return 'Hết hàng';
      default: return status;
    }
  }

  getActivityText(type: string): string {
    switch (type) {
      case 'added': return 'thêm';
      case 'updated': return 'cập nhật';
      case 'deleted': return 'xóa';
      default: return type;
    }
  }
} 