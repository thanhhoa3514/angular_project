import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { validate } from 'class-validator';
import { LoginDTO } from '../dtos/user/login.dto';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoading = false; 
  errorMessage = '';

  constructor(private loginService: LoginService, private router: Router
    , private authService: AuthService,
    private alertService: AlertService
  ) {}

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  async onSubmit(event: Event, phone_number: string, password: string) {
    event.preventDefault();

    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = new LoginDTO({ phone_number, password });
 

    const errors = await validate(loginData);
    if (errors.length > 0) {
      console.error('Lỗi xác thực:', errors); 
      this.errorMessage = 'Thông tin đăng nhập không hợp lệ.';
      this.isLoading = false;
      return;
    }


    

    this.loginService.login(loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.authService.login();
        this.alertService.success('Đăng nhập thành công!');
        this.router.navigate(['/home']); 
      },
      error: (error) => {
        console.error('Lỗi đăng nhập:', error);
        this.alertService.error('Đăng nhập thất bại: ' + (error.error?.message || 'Vui lòng kiểm tra thông tin đăng nhập'));
        this.isLoading = false; 
      },
      complete: () => {
        this.isLoading = false; 
      }
    });
  }
}
