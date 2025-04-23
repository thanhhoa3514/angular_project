import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="oauth-callback-container">
      <div class="loader">Đang xử lý đăng nhập...</div>
    </div>
  `,
  styles: [`
    .oauth-callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .loader {
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
    }
  `]
})
export class OAuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Lấy các tham số từ URL
    const code = this.route.snapshot.queryParams['code'];
    const state = this.route.snapshot.queryParams['state'];
    
    if (code && state) {
      this.processOAuth2Callback(code, state);
    } else {
      this.router.navigate(['/auth/login']);
      this.alertService.error('Lỗi xác thực: Thiếu thông tin xác thực.');
    }
  }

  private processOAuth2Callback(code: string, state: string): void {
    this.authService.handleOAuth2Callback(code, state).subscribe({
      next: () => {
        this.alertService.success('Đăng nhập thành công!');
        // Lấy URL để redirect sau khi đăng nhập
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        console.error('Lỗi xử lý OAuth callback:', error);
        this.alertService.error('Đăng nhập thất bại: ' + 
          (error.error?.message || 'Có lỗi xảy ra trong quá trình xác thực.'));
        this.router.navigate(['/auth/login']);
      }
    });
  }
} 