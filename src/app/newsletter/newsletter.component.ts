import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
  email: string = '';
  
  constructor(private alertService: AlertService) {}
  
  onSubmit() {
    if (this.validateEmail(this.email)) {
      // Gửi email đăng ký đến API (sẽ thêm sau)
      console.log('Email đăng ký:', this.email);
      this.alertService.success('Đăng ký nhận tin thành công!');
      this.email = '';
    } else {
      this.alertService.error('Vui lòng nhập email hợp lệ!');
    }
  }
  
  private validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
}
