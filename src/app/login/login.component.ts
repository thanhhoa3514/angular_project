import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { validate } from 'class-validator';
import { LoginDTO } from '../dtos/user/login.dto';
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

  constructor(private loginService: LoginService, private router: Router
    , private authService: AuthService) {}
  // Hàm để toggle hiển thị mật khẩu
  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  async onSubmit(event: Event, phone_number: string, password: string) {
    event.preventDefault();
    console.log('Đăng nhập được gọi');
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = new LoginDTO({ phone_number, password });
    console.log('Dữ liệu đăng nhập:', loginData);
    // Validate login data
    const errors = await validate(loginData);
    if (errors.length > 0) {
      console.error('Lỗi xác thực:', errors); 
      this.errorMessage = 'Thông tin đăng nhập không hợp lệ.';
      this.isLoading = false;
      return;
    }


    console.log('Gửi yêu cầu đăng nhập');

    this.loginService.login(loginData).subscribe({
      next: (response) => {
        console.log('Đăng nhập thành công', response);
        localStorage.setItem('token', response.token);
        this.authService.login();
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
