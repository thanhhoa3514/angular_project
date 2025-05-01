import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  product_count: number;
}

interface CategoryStats {
  total: number;
  totalGrowth: number;
  active: number;
  activeGrowth: number;
}

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  categoryStats: CategoryStats = {
    total: 12,
    totalGrowth: 8.5,
    active: 10,
    activeGrowth: 5.2,
  };
  
  showCategoryForm = false;
  showCategoryDetails = false;
  selectedCategory: Category | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    // In a real app, this would be fetched from an API
    this.categories = [
      {
        id: 1,
        name: 'Điện thoại',
        description: 'Các loại điện thoại di động, smartphone',
        created_at: '2023-09-01',
        updated_at: '2023-11-05',
        product_count: 25
      },
      {
        id: 2,
        name: 'Laptop',
        description: 'Máy tính xách tay, notebook, ultrabook',
        created_at: '2023-09-01',
        updated_at: '2023-10-20',
        product_count: 18
      },
      {
        id: 3,
        name: 'Máy tính bảng',
        description: 'Các loại máy tính bảng, tablet',
        created_at: '2023-09-15',
        updated_at: '2023-11-12',
        product_count: 12
      },
      {
        id: 4,
        name: 'Phụ kiện',
        description: 'Các loại phụ kiện cho điện thoại, laptop, tablet',
        created_at: '2023-09-20',
        updated_at: '2023-11-15',
        product_count: 42
      },
      {
        id: 5,
        name: 'Âm thanh',
        description: 'Các thiết bị âm thanh như tai nghe, loa bluetooth',
        created_at: '2023-10-05',
        updated_at: '2023-11-10',
        product_count: 16
      }
    ];
    
    this.filteredCategories = [...this.categories];
  }

  searchCategories(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    
    if (!searchTerm) {
      this.filteredCategories = [...this.categories];
      return;
    }
    
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm)
    );
  }

  openAddCategoryModal(): void {
    this.selectedCategory = null;
    this.showCategoryForm = true;
    this.showCategoryDetails = false;
  }

  openCategoryDetails(category: Category): void {
    this.selectedCategory = category;
    this.showCategoryDetails = true;
    this.showCategoryForm = false;
  }

  editCategory(category: Category): void {
    this.selectedCategory = category;
    this.showCategoryForm = true;
    this.showCategoryDetails = false;
  }

  deleteCategory(category: Category): void {
    // This would show a confirmation dialog before deleting
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      const index = this.categories.findIndex(c => c.id === category.id);
      if (index !== -1) {
        this.categories.splice(index, 1);
        this.filteredCategories = [...this.categories];
      }
    }
  }

  closeModal(): void {
    this.showCategoryForm = false;
    this.showCategoryDetails = false;
    this.selectedCategory = null;
  }

  saveCategory(category: Partial<Category>): void {
    if (this.selectedCategory) {
      // Update existing category
      const index = this.categories.findIndex(c => c.id === this.selectedCategory!.id);
      if (index !== -1) {
        this.categories[index] = {
          ...this.categories[index],
          name: category.name || '',
          description: category.description || '',
          updated_at: new Date().toISOString().slice(0, 10)
        };
      }
    } else {
      // Add new category
      const newId = Math.max(...this.categories.map(c => c.id)) + 1;
      const newCategory: Category = {
        id: newId,
        name: category.name || '',
        description: category.description || '',
        created_at: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString().slice(0, 10),
        product_count: 0
      };
      this.categories.push(newCategory);
    }
    this.filteredCategories = [...this.categories];
    this.closeModal();
  }
} 