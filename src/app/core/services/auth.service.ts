import { Injectable,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  login() {
    this.loggedIn.next(true);
  }

  logout() {
    this.loggedIn.next(false);
  }



  // // Lưu token vào localStorage
  // saveToken(token: string): void {
  //   localStorage.setItem('token', token);
  // }

  // // Lấy token từ localStorage
  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  // // Xóa token (logout)
  // removeToken(): void {
  //   localStorage.removeItem('token');
  // }

  // // Kiểm tra đã đăng nhập chưa
  // isLoggedIn(): boolean {
  //   return !!this.getToken();
  // }

  // // Lấy thông tin user hiện tại
  // getCurrentUser(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/me`, {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.getToken()}`
  //     })
  //   });
  // }
} 