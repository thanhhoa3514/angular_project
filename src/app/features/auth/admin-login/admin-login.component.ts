import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService, LoginCredentials } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  loginAttempts = 0;
  isLocked = false;
  lockoutTime: number | null = null;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkLockout();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  checkLockout(): void {
    if (!this.isBrowser) return;
    
    const lockoutUntil = localStorage.getItem('adminLockoutUntil');
    if (lockoutUntil) {
      const lockTime = parseInt(lockoutUntil, 10);
      if (lockTime > Date.now()) {
        this.isLocked = true;
        this.lockoutTime = Math.ceil((lockTime - Date.now()) / 1000);
        
        // Set up countdown timer
        const countdownInterval = setInterval(() => {
          if (this.lockoutTime && this.lockoutTime > 0) {
            this.lockoutTime--;
          } else {
            this.isLocked = false;
            this.loginAttempts = 0;
            localStorage.removeItem('adminLoginAttempts');
            localStorage.removeItem('adminLockoutUntil');
            clearInterval(countdownInterval);
          }
        }, 1000);
      } else {
        // Lockout period has expired
        localStorage.removeItem('adminLoginAttempts');
        localStorage.removeItem('adminLockoutUntil');
        this.isLocked = false;
        this.loginAttempts = 0;
      }
    } else {
      // Get previous attempts
      const attempts = localStorage.getItem('adminLoginAttempts');
      this.loginAttempts = attempts ? parseInt(attempts, 10) : 0;
    }
  }

  onSubmit(): void {
    if (this.isLocked) {
      this.notificationService.showError('Your account is temporarily locked. Please try again later.');
      return;
    }

    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials: LoginCredentials = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe
      };
      
      // Sử dụng AuthService để đăng nhập
      this.authService.adminLogin(credentials)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (response) => {
            this.notificationService.showSuccess('Login successfully');
            
            if (this.isBrowser) {
              // Reset login attempts
              localStorage.removeItem('adminLoginAttempts');
              localStorage.removeItem('adminLockoutUntil');
            }
            
            // Navigate to dashboard
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          },
          error: (error) => {
            if (this.isBrowser) {
              // Increment login attempts
              this.loginAttempts++;
              localStorage.setItem('adminLoginAttempts', this.loginAttempts.toString());
              
              // Lock account after 5 failed attempts
              if (this.loginAttempts >= 5) {
                const lockoutUntil = Date.now() + (5 * 60 * 1000); // 5 minutes
                localStorage.setItem('adminLockoutUntil', lockoutUntil.toString());
                this.isLocked = true;
                this.lockoutTime = 5 * 60; // 5 minutes in seconds
                
                this.notificationService.showError('Too many failed login attempts. Your account has been locked for 5 minutes.');
              } else {
                this.notificationService.showError(error.error?.message || 'Invalid username or password');
              }
            } else {
              this.notificationService.showError(error.error?.message || 'Invalid username or password');
            }
          }
        });
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.notificationService.showWarning('Please fill all required fields correctly');
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  getFormControlError(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      }
      if (control.hasError('minlength')) {
        const requiredLength = control.getError('minlength').requiredLength;
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }
} 