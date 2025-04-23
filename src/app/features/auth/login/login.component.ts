import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { LoginDTO } from '../../../core/dtos/user/login.dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    // Lấy URL để redirect sau khi đăng nhập
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Kiểm tra xem có code và state trả về từ OAuth2 không
    const code = this.route.snapshot.queryParams['code'];
    const state = this.route.snapshot.queryParams['state'];
    
    if (code && state) {
      this.handleOAuth2Callback(code, state);
    }
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  onSubmit(event: Event, phone_number: string, password: string) {
    event.preventDefault();

    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Kiểm tra đầu vào cơ bản
    if (!phone_number || !password) {
      this.errorMessage = 'Vui lòng nhập số điện thoại và mật khẩu';
      this.isLoading = false;
      return;
    }

    // Create LoginDTO object to match the updated AuthService
    const loginRequest: LoginDTO = {
      phone_number: phone_number,
      password: password
    };

    // Use the updated login method with LoginDTO
    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.alertService.success('Đăng nhập thành công!');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        console.error('Lỗi đăng nhập:', error);
        this.alertService.error('Đăng nhập thất bại: ' + (error.error?.message || 'Vui lòng kiểm tra thông tin đăng nhập'));
        this.errorMessage = error.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Xử lý đăng nhập bằng Google
  loginWithGoogle(): void {
    this.isLoading = true;
    // Gọi đến phương thức OAuth2 trong AuthService
    this.authService.googleLogin();
  }

  // Xử lý callback từ OAuth2
  private handleOAuth2Callback(code: string, state: string): void {
    this.isLoading = true;
    
    this.authService.handleOAuth2Callback(code, state).subscribe({
      next: () => {
        this.alertService.success('Đăng nhập với Google thành công!');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Lỗi đăng nhập OAuth2:', error);
        this.alertService.error('Đăng nhập với Google thất bại: ' + (error.error?.message || 'Đã xảy ra lỗi'));
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
