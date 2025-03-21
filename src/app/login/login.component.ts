import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoading = false; // Thêm thuộc tính isLoading
  errorMessage = '';

  constructor(private loginService: LoginService, private router: Router) {}
  // Hàm để toggle hiển thị mật khẩu
  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  onSubmit(event: Event, phone: string, password: string) {
    event.preventDefault();
    
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.loginService.login({ phone, password }).subscribe({
      next: (response) => {
        console.log('Đăng nhập thành công', response);
        localStorage.setItem('token', response.token); // Store the token in local storage
        this.router.navigate(['/home']); // Chuyển hướng đến trang chính
      },
      error: (error) => {
        console.error('Lỗi đăng nhập:', error);
        this.errorMessage = 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.'; // Cập nhật thông báo lỗi
        this.isLoading = false; // Kết thúc quá trình tải
      },
      complete: () => {
        this.isLoading = false; // Kết thúc quá trình tải
      }
    });
  }
}
