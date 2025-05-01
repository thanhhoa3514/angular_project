import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Order } from '../components/orders-table/orders-table.component';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() { }

  exportToExcel(orders: Order[], fileName: string): void {
    // Chuẩn bị dữ liệu
    const data = orders.map(order => ({
      'Order ID': order.id,
      'Customer': order.customer,
      'Status': order.status,
      'Date': order.date,
      'Amount': `$${order.amount.toFixed(2)}`
    }));

    // Tạo worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Tạo workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Tạo file và tải xuống
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
} 