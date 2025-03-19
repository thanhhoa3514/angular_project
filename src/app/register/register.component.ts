import { Component, inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService, UserRegistration } from '../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { environment } from '../../environments/environment.development';
import { RegisterService } from '../services/register.service';
import { ValidationService } from '../validation/register.validation';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,HttpClientModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private registerService = inject(RegisterService);
  private validationService = inject(ValidationService);
  private router = inject(Router);
  private http = inject(HttpClient);
  // Model cho form đăng ký
  user: UserRegistration = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: new Date(),
    address: '',
    agreeToTerms: false
  };

  passwordStrength = {
    width: '0%',
    color: '#e5e7eb',
    text: 'Mật khẩu phải có ít nhất 8 ký tự'
  };


  // Các tham số cho validate tuổi
  readonly MIN_AGE = 16; // Tuổi tối thiểu
  readonly MAX_AGE = 100; // Tuổi tối đa


  // const apiUrl=environment.apiUrl+'/users/register';



  createFullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`.trim();
  }
  passwordVisible = false;
  confirmPasswordVisible = false;
  errorMessage = '';
  isLoading = false;
  dateOfBirthError = '';

  // constructor(
  //   @Optional() private authService: AuthService,
  //   private router: Router,
  //   private http: HttpClient,

  // ) {}

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
        // Chuyển hướng đến trang đăng nhập
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Lỗi đăng ký:', error);
        this.errorMessage = error.error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
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
