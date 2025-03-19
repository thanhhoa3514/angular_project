// Tạo register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegistration } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
    private apiUrl = 'http://localhost:8080/api/v1'; 
  constructor(private http: HttpClient) {}
  
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
    
    // const apiUrl = environment.apiUrl || 'http://localhost:8080/api/v1';
    return this.http.post(`${this.apiUrl}/auth/users/register`, registerData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}