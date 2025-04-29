import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  resetPasswordStepForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  successMessage = '';
  errorMessage = '';
  email = '';
  
  // Track the current step in the password reset flow
  currentStep = 1; // 1: OTP verification, 2: Password reset
  resetToken = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  
  constructor() {
    // Form for step 1: OTP verification
    this.resetPasswordForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });
    
    // Form for step 2: Password reset
    this.resetPasswordStepForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      } else {
        this.router.navigate(['/auth/forgot-password']);
      }
    });
  }
  
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    
    return null;
  }
  
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  
  // Step 1: Verify OTP and get reset token
  verifyOTP(): void {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.resetPasswordForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    const code = this.resetPasswordForm.get('code')?.value;
    
    this.authService.verifyOTPAndGetResetToken(this.email, code)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response && response.status === 200) {
            // Extract the resetToken from the response
            // Adjust the property name based on your API response structure
            this.resetToken = response.token || response.resetToken || response.data?.resetToken || '';
            
            if (!this.resetToken) {
              this.errorMessage = 'Không tìm thấy token đặt lại mật khẩu trong phản hồi từ máy chủ';
              return;
            }
            
            this.successMessage = 'Mã xác thực hợp lệ. Vui lòng đặt mật khẩu mới!';
            // Move to step 2
            this.currentStep = 2;
          } else {
            this.errorMessage = response?.message || 'Mã xác thực không hợp lệ.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || 'Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại.';
        }
      });
  }
  
  // Step 2: Reset password with token
  resetPassword(): void {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.resetPasswordStepForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    const newPassword = this.resetPasswordStepForm.get('password')?.value;
    const confirmPassword = this.resetPasswordStepForm.get('confirmPassword')?.value;
    
    this.authService.resetPasswordWithToken(this.resetToken, newPassword, confirmPassword)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response && response.status === 200) {
            this.successMessage = 'Đặt lại mật khẩu thành công! Bạn sẽ được chuyển đến trang đăng nhập.';
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 3000);
          } else {
            this.errorMessage = response?.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.';
        }
      });
  }
} 