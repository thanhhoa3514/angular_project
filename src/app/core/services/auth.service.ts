import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, finalize, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginDTO } from '../dtos/user/login.dto';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface User {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  agreeToTerms: boolean;
}

interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  roles: string[];
  // Thêm các trường khác từ JWT payload nếu cần
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private refreshingToken = false;
  private refreshTokenTimeout: any;
  private isBrowser: boolean;
  // Keep the auth endpoint for token validation
  private authApiUrl = `${environment.apiUrl}/auth`;
  // Add users endpoint for login/register
  private usersApiUrl = `${environment.apiUrl}/users`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  // Loading state for UI feedback
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private tokenExpirationTimer: any;

  public apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private jwtHelper: JwtHelperService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadUserFromStorage();
    this.checkAuthStatus();
  }

  private loadUserFromStorage(): void {
    // With HTTP-only cookies, we can't access the token directly from localStorage.
    // We'll rely on the validate-token endpoint to get the user instead.
    // This method is kept for backward compatibility.
    if (this.isBrowser) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          this.currentUserSubject.next(user);
          this.loggedInSubject.next(true);
          
          // We won't call autoLogout here since we can't access token expiration
          // The validate-token endpoint will handle refreshing tokens and logout if needed
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
          localStorage.removeItem('user');
          this.loggedInSubject.next(false);
          this.currentUserSubject.next(null);
        }
      }
    }
  }

  // Kiểm tra trạng thái xác thực khi khởi động app
  private checkAuthStatus(): void {
    // Skip validation in SSR
    if (!this.isBrowser) {
      this.loggedInSubject.next(false);
      this.currentUserSubject.next(null);
      return;
    }

    // Try to validate token silently, don't break app if it fails
    this.http.get<any>(`${this.authApiUrl}/validate-token`, {
      withCredentials: true
    }).pipe(
      catchError(() => {
        console.log('Token validation skipped - endpoint might not be available yet');
        this.loggedInSubject.next(false);
        this.currentUserSubject.next(null);
        return of({ valid: false });  // Return a valid observable with a "not valid" response
      })
    ).subscribe(response => {
      if (response && response.valid) {
        this.loggedInSubject.next(true);
        this.currentUserSubject.next(response.user);
      } else {
        this.loggedInSubject.next(false);
        this.currentUserSubject.next(null);
      }
    });
  }

  // Đăng nhập thông thường
  login(credentials: LoginDTO): Observable<any> {
    // Adapter to convert LoginDTO to LoginCredentials
    const loginCredentials: LoginCredentials = {
      username: credentials.phone_number || credentials.email || '',
      password: credentials.password
    };

    return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, loginCredentials, {
      withCredentials: true, // Quan trọng: Cho phép server set cookies
      observe: 'response' as 'response'
    }).pipe(
      tap(response => {
        const authData = response.body;
        if (authData) {
          this.loggedInSubject.next(true);
          this.currentUserSubject.next(authData.user);
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Đăng nhập admin
  adminLogin(credentials: LoginCredentials): Observable<any> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/admin/login`, credentials, {
      withCredentials: true, // Quan trọng: Cho phép server set cookies
      observe: 'response' as 'response'
    }).pipe(
      tap(response => {
        const authData = response.body;
        if (authData) {
          this.loggedInSubject.next(true);
          this.currentUserSubject.next(authData.user);
          // Không lưu token vào localStorage vì chúng ta dùng HTTP-only cookies
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Đăng xuất
  logout(): Observable<any> {
    return this.http.post(`${this.authApiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.loggedInSubject.next(false);
        this.currentUserSubject.next(null);
        // Remove user from localStorage if it exists
        if (this.isBrowser) {
          localStorage.removeItem('user');
          this.router.navigate(['/auth/login']);
        }
      }),
      catchError(error => {
        // Xử lý lỗi khi đăng xuất
        console.error('Logout error:', error);
        // Vẫn clear state ngay cả khi API failed
        this.loggedInSubject.next(false);
        this.currentUserSubject.next(null);
        // Remove user from localStorage if it exists
        if (this.isBrowser) {
          localStorage.removeItem('user');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Làm mới token
  refreshToken(): Observable<any> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/refresh-token`, {}, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.loggedInSubject.next(true);
        if (response.user) {
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        // Nếu không thể refresh token, đăng xuất
        this.loggedInSubject.next(false);
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  // Kiểm tra xem người dùng đã đăng nhập chưa
  isAuthenticated(): boolean {
    return this.loggedInSubject.getValue();
  }

  // Lấy thông tin user hiện tại
  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  // Updated to use the users API endpoint
  register(user: UserRegistration): Observable<any> {
    const dateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : null;
    const fullName = user.lastName + " " + user.firstName;
    
    const registerData = {
      fullname: fullName,
      email: user.email,
      address: user.address,
      phone_number: user.phone,
      password: user.password,
      retype_password: user.confirmPassword,
      date_of_birth: dateOfBirth,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 3
    };

    return this.http.post(`${this.usersApiUrl}/register`, registerData, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Securely stores authentication tokens
   * @param token Access token
   * @param refreshToken Refresh token
   */
  private securelyStoreTokens(token: string, refreshToken: string): void {
    // With HTTP-only cookies, tokens are stored by the server in cookies
    // This method is kept for backward compatibility
    console.log('Using HTTP-only cookies for token storage. No need to store tokens in localStorage.');
  }

  /**
   * Securely removes authentication tokens
   */
  private securelyRemoveTokens(): void {
    // With HTTP-only cookies, tokens are removed by the server
    // This method is kept for backward compatibility
    console.log('Using HTTP-only cookies for token storage. Tokens will be removed via /logout endpoint.');
  }

  /**
   * Validates if current token exists and is not expired
   * @returns boolean indicating if token is valid
   */
  private hasValidToken(): boolean {
    if (!this.isBrowser) return false;
    
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decodedToken = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      
      // Kiểm tra token đã hết hạn chưa
      if (!decodedToken || !decodedToken.exp || decodedToken.exp < currentTime) {
        // Token đã hết hạn hoặc không hợp lệ
        console.log('Token đã hết hạn hoặc không hợp lệ');
        return false;
      }
      
      // Kiểm tra thời gian còn lại của token để quyết định refresh
      const timeToExpire = decodedToken.exp - currentTime;
      if (timeToExpire < 300) { // 5 phút
        // Chuẩn bị refresh token
        this.refreshToken().subscribe({
          error: (err) => console.log('Could not refresh token:', err)
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  /**
   * Decodes JWT token to access its payload
   * @param token JWT token string
   * @returns Decoded token payload
   */
  private decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }

  /**
   * Gets the current token from storage
   * @returns The token string or null if not found
   */
  public getToken(): string | null {
    // Since we're using HTTP-only cookies, we can't directly access the token.
    // We'll use isAuthenticated state instead as a proxy to determine if we have a valid token.
    if (this.isBrowser && this.loggedInSubject.getValue()) {
      // We're returning a dummy token here since the real token is in HTTP-only cookies
      // and not accessible via JavaScript. The interceptor will include cookies automatically.
      return 'http-only-cookie-token';
    }
    return null;
  }

  /**
   * Starts timer to refresh token before expiration
   */
  private startRefreshTokenTimer() {
    const token = this.getToken();
    if (!token) return;
    
    try {
      const decodedToken = this.decodeToken(token);
      const expires = new Date(decodedToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
      
      this.stopRefreshTokenTimer();
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    } catch (error) {
      console.error('Error starting refresh timer:', error);
    }
  }
  
  /**
   * Stops the refresh token timer
   */
  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  /**
   * Generic error handler for HTTP requests
   * @param error HTTP error response
   * @returns Observable that throws the error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // Handle specific error codes
      if (error.status === 401) {
        errorMessage = 'Unauthorized: Please log in again';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden: You do not have permission to access this resource';
      }
    }
    
    console.error(errorMessage, error);
    return throwError(() => error);
  }

  /**
   * Initiates Google login flow
   * @returns Observable with login response
   */
  loginWithGoogle(): Observable<LoginResponse> {
    // Redirect to the backend OAuth2 endpoint for Google
    window.location.href = `${this.authApiUrl}/oauth2/authorization/google`;
    return of({} as LoginResponse); // Return empty observable as we're redirecting
  }

  /**
   * Initiates Facebook login flow
   * @returns Observable with login response
   */
  loginWithFacebook(): Observable<LoginResponse> {
    // Redirect to the backend OAuth2 endpoint for Facebook
    window.location.href = `${this.authApiUrl}/oauth2/authorization/facebook`;
    return of({} as LoginResponse); // Return empty observable as we're redirecting
  }

  /**
   * Handles the OAuth2 callback from social login providers
   * @param token The token received from the OAuth2 callback
   * @param refreshToken The refresh token received from the OAuth2 callback
   * @param user The user information received from the OAuth2 callback
   */
  handleOAuthCallback(token: string, refreshToken: string, user: User): void {
    if (this.isBrowser) {
      this.securelyStoreTokens(token, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.loggedInSubject.next(true);
      this.startRefreshTokenTimer();
      this.router.navigate(['/']);
    }
  }

  autoLogout(decodedToken: any): void {
    if (!decodedToken || !decodedToken.exp) return;
    
    const expirationDate = new Date(decodedToken.exp * 1000);
    const now = new Date();
    const timeLeft = expirationDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
      this.logout();
      return;
    }

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, timeLeft);
  }

  // Đăng nhập Google OAuth2
  googleLogin(): void {
    // Lấy URL callback
    const redirectUri = `${window.location.origin}/auth/oauth/callback`;
    // Redirect đến endpoint OAuth2 của Google trên backend với callback URL
    window.location.href = `${this.apiUrl}/oauth2/authorize/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  // Xử lý callback OAuth2
  handleOAuth2Callback(code: string, state: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/oauth2/callback?code=${code}&state=${state}`)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            const decodedToken = jwtDecode(response.token);
            
            // Xử lý đúng kiểu dữ liệu từ token
            const user = this.extractUserFromToken(decodedToken);
            this.currentUserSubject.next(user);
            this.loggedInSubject.next(true);
            this.autoLogout(decodedToken);
          }
        }),
        catchError(error => {
          console.error('OAuth callback error:', error);
          return throwError(() => error);
        })
      );
  }
  
  // Phương thức để chuyển đổi từ token sang đối tượng User
  private extractUserFromToken(decodedToken: any): User {
    return {
      id: decodedToken.id || 0,
      fullName: decodedToken.name || '',
      phone: decodedToken.phone || '',
      email: decodedToken.email || '',
      role: decodedToken.role || ''
    };
  }

  /**
   * Generates an OTP for the given email and purpose
   * @param email User's email address
   * @param type Type of OTP (PASSWORD_RESET, REGISTRATION, TWO_FACTOR)
   * @returns Observable with response
   */
  generateOTP(email: string, type: 'PASSWORD_RESET' | 'REGISTRATION' | 'TWO_FACTOR'): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.http.post(`${this.authApiUrl}/otp/generate`, {
      email,
      type
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  
  /**
   * Verifies an OTP
   * @param email User's email address
   * @param otp The OTP code to verify
   * @param type Type of OTP (PASSWORD_RESET, REGISTRATION, TWO_FACTOR)
   * @returns Observable with response
   */
  verifyOTP(email: string, otp: string, type: 'PASSWORD_RESET' | 'REGISTRATION' | 'TWO_FACTOR'): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.http.post(`${this.authApiUrl}/otp/verify`, {
      email,
      otp,
      type
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  
  /**
   * Requests a password reset for the specified email address
   * @param email The user's email address
   * @returns Observable with the response
   */
  requestPasswordReset(email: string): Observable<any> {
    this.loadingSubject.next(true);
    
    // Sử dụng API OTP để gửi mã xác thực
    return this.generateOTP(email, 'PASSWORD_RESET');
  }
  
  /**
   * Verifies an OTP and returns a reset token
   * @param email User's email address
   * @param otp The OTP code to verify
   * @returns Observable with response containing a reset token
   */
  verifyOTPAndGetResetToken(email: string, otp: string): Observable<any> {
    this.loadingSubject.next(true);
    
    // Use the auth API endpoint with correct path structure
    return this.http.post(`${environment.apiUrl}/auth/otp/verify`, {
      email,
      otp,
      type: 'PASSWORD_RESET'
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(response => {
        console.log('OTP verification response:', response);
      }),
      catchError(error => {
        console.error('OTP verification error:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  
  /**
   * Resets the user's password using a reset token
   * @param resetToken The token received after OTP verification
   * @param newPassword The new password
   * @param confirmPassword The confirmation of the new password
   * @returns Observable with the response
   */
  resetPasswordWithToken(resetToken: string, newPassword: string, confirmPassword: string): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.http.post(`${environment.apiUrl}/auth/otp/reset-password`, {
      resetToken,
      newPassword,
      confirmPassword
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(response => {
        console.log('Password reset response:', response);
      }),
      catchError(error => {
        console.error('Password reset error:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Gets user roles from the current user
   * @returns Array of user roles
   */
  getUserRoles(): string[] {
    const user = this.getCurrentUser();
    if (!user) {
      return [];
    }
    // Convert the single role to an array for compatibility with role guard
    return [user.role];
  }

  /**
   * Checks if user has a specific role
   * @param role The role to check
   * @returns boolean indicating if user has the role
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  /**
   * Checks if user has admin role
   * @returns boolean indicating if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}

