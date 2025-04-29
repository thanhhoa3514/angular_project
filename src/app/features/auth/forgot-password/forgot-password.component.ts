import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
    });
  }
  
  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    const email = this.forgotPasswordForm.get('email')?.value;
    
    this.authService.generateOTP(email, 'PASSWORD_RESET')
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response && response.status === 200) {
            this.successMessage = 'Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.';
            
            setTimeout(() => {
              this.router.navigate(['/auth/reset-password'], { 
                queryParams: { email }
              });
            }, 3000);
          } else {
            this.errorMessage = response?.message || 'Đã xảy ra lỗi khi gửi mã xác thực.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || 'Đã xảy ra lỗi khi gửi mã xác thực. Vui lòng thử lại.';
        }
      });
  }
}
