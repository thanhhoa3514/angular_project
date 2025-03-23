import { Component, inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import {  UserRegistration } from '../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { RegisterService } from '../services/register.service';
import { ValidationService } from '../validation/register.validation';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    RouterModule,
    HttpClientModule 
  ],
  providers: [
    // Đăng ký services cụ thể cho component này
    RegisterService,
    ValidationService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(
    private registerService: RegisterService,
    private validationService: ValidationService,
    private router: Router,
    private alertService: AlertService
  ) {}
  // Model cho form đăng ký
  user: UserRegistration = {
    firstName: '',
    lastName: '',
    email: '',
    address:'',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: new Date(),
    agreeToTerms: false
  };

  passwordStrength = {
    width: '0%',
    color: '#e5e7eb',
    text: 'Mật khẩu phải có ít nhất 8 ký tự'
  };

  ngOnInit(): void {
    // Kiểm tra xem các services đã được inject đúng chưa
    console.log('RegisterService:', !!this.registerService);
    console.log('ValidationService:', !!this.validationService);
  }



  createFullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`.trim();
  }
  passwordVisible = false;
  confirmPasswordVisible = false;
  errorMessage = '';
  isLoading = false;
  dateOfBirthError = '';

 

  // Hàm để toggle hiển thị mật khẩu
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  // Hàm kiểm tra độ mạnh của mật khẩu
  checkPasswordStrength(password: string): void {
    this.passwordStrength = this.validationService.checkPasswordStrength(password);
  }

  validateAge(): boolean {
    const result = this.validationService.validateAge(this.user.dateOfBirth);
    this.dateOfBirthError = result.message;
    return result.valid;
  }
  
  // Kiểm tra ngày sinh khi người dùng thay đổi
  onDateOfBirthChange(): void {
    this.validateAge();
  }




  // Xử lý khi submit form
  onSubmit(event: Event) {
    event.preventDefault();
    if (this.isLoading) return;
    
    if (!this.validateAge()) {
      this.errorMessage = this.dateOfBirthError;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.registerService.register(this.user).subscribe({
      
      next: (response) => {
        console.log('Đăng ký thành công', response);
        this.alertService.success('Đăng ký tài khoản thành công!');
        this.router.navigate(['/login']);
        // Chuyển hướng đến trang đăng nhập
      },
      error: (error) => {
        
        console.error('Lỗi đăng ký:', error);
        this.alertService.error('Đăng ký thất bại: ' + (error.error?.message || 'Vui lòng kiểm tra lại thông tin'));
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Kiểm tra xác nhận mật khẩu
  passwordsMatch(): boolean {
    return this.validationService.passwordsMatch(this.user.password, this.user.confirmPassword);
  }
    
}
