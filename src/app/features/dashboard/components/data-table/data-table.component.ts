import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/dashboard.service';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() title = 'Top Products';
  @Input() data: Product[] = [];
  @Input() loading = false;
  @Input() columns: { field: string; header: string }[] = [
    { field: 'id', header: '#' },
    { field: 'name', header: 'NAME' },
    { field: 'category', header: 'CATEGORY' },
    { field: 'price', header: 'PRICE' },
    { field: 'status', header: 'STATUS' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Format currency values
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  // Get cell value based on column field
  getCellValue(item: any, column: { field: string; header: string }): string {
    if (column.field === 'price') {
      return this.formatCurrency(item[column.field]);
    }
    return item[column.field];
  }

  // Get status class based on status value
  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
}
