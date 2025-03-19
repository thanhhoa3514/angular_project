import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService, UserRegistration } from '../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,HttpClientModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
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

  constructor(
    // private authService: AuthService,
    private router: Router,
    private http: HttpClient,

  ) {}

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
    // Reset to default
    this.passwordStrength = {
      width: '0%',
      color: '#e5e7eb',
      text: 'Mật khẩu phải có ít nhất 8 ký tự'
    };

    if (!password) return;

    // Các tiêu chí kiểm tra
    const lengthValid = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Tính điểm
    let score = 0;
    if (lengthValid) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSpecialChars) score += 1;

    // Hiển thị độ mạnh
    if (password.length < 8) {
      this.passwordStrength = {
        width: '10%',
        color: '#ef4444', // Đỏ
        text: 'Mật khẩu quá ngắn'
      };
    } else if (score <= 2) {
      this.passwordStrength = {
        width: '25%',
        color: '#ef4444', // Đỏ
        text: 'Mật khẩu yếu'
      };
    } else if (score <= 3) {
      this.passwordStrength = {
        width: '50%',
        color: '#f59e0b', // Vàng cam
        text: 'Mật khẩu trung bình'
      };
    } else if (score <= 4) {
      this.passwordStrength = {
        width: '75%',
        color: '#3b82f6', // Xanh dương
        text: 'Mật khẩu mạnh'
      };
    } else {
      this.passwordStrength = {
        width: '100%',
        color: '#10b981', // Xanh lá
        text: 'Mật khẩu rất mạnh'
      };
    }
  }

  validateAge(): boolean {
    if (!this.user.dateOfBirth) {
      this.dateOfBirthError = 'Ngày sinh không được để trống';
      return false;
    }
    
    const birthDate = new Date(this.user.dateOfBirth);
    const today = new Date();
    
    // Kiểm tra ngày có hợp lệ không
    if (isNaN(birthDate.getTime())) {
      this.dateOfBirthError = 'Ngày sinh không hợp lệ';
      return false;
    }
    
    // Tính tuổi
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Điều chỉnh tuổi nếu chưa đến sinh nhật trong năm nay
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Kiểm tra tuổi tối thiểu
    if (age < this.MIN_AGE) {
      this.dateOfBirthError = `Bạn phải đủ ${this.MIN_AGE} tuổi để đăng ký`;
      return false;
    }
    
    // Kiểm tra tuổi tối đa
    if (age > this.MAX_AGE) {
      this.dateOfBirthError = `Tuổi không được vượt quá ${this.MAX_AGE}`;
      return false;
    }
    
    // Xóa thông báo lỗi nếu tuổi hợp lệ
    this.dateOfBirthError = '';
    return true;
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

    // this.authService.register(this.user).subscribe({
    //   next: (response) => {
    //     console.log('Đăng ký thành công', response);
    //     // Chuyển hướng đến trang đăng nhập
    //     this.router.navigate(['/login']);
    //   },
    //   error: (error) => {
    //     console.error('Lỗi đăng ký:', error);
    //     this.errorMessage = error.error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
    //     this.isLoading = false;
    //   },
    //   complete: () => {
    //     this.isLoading = false;
    //   }
    // });
  }

  // Kiểm tra xác nhận mật khẩu
  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }
    
}
