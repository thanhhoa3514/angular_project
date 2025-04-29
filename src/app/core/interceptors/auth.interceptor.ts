import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Không thêm token cho các request đến API xác thực
    if (request.url.includes('/auth/login') || request.url.includes('/users/login') || 
        request.url.includes('/users/register') || request.url.includes('/auth/refresh-token')) {
      return next.handle(request);
    }
    
    const token = this.authService.getToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(success => {
          this.isRefreshing = false;
          
          if (success) {
            this.refreshTokenSubject.next(true);
            const token = this.authService.getToken();
            if (token) {
              return next.handle(this.addToken(request, token));
            }
          }
          
          // Nếu refresh token thất bại, đăng xuất người dùng
          this.authService.logout();
          return throwError(() => new Error('Session expired. Please login again.'));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // Đợi cho đến khi refresh token hoàn tất
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          const newToken = this.authService.getToken();
          if (newToken) {
            return next.handle(this.addToken(request, newToken));
          }
          return throwError(() => new Error('No token available'));
        })
      );
    }
  }
}