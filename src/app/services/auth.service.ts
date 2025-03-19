import { Injectable,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date,
  agreeToTerms: boolean;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // constructor(private http: HttpClient) { }

  // Đăng ký tài khoản mới
  register(user: UserRegistration): Observable<any> {
    const dateOfBirth = user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : null;
    const registerData = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone_number: user.phone,
      password: user.password,
      retype_password: user.confirmPassword,
      date_of_birth: dateOfBirth,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 1
    };
    return this.http.post(`${this.apiUrl}/auth/users/register`, registerData, this.httpOptions);
  }

  // Đăng nhập
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, loginRequest, this.httpOptions);
  }

  // Lưu token vào localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Lấy token từ localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Xóa token (logout)
  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Kiểm tra đã đăng nhập chưa
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Lấy thông tin user hiện tại
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }
} 