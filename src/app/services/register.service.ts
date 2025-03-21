import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegistration } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
    
    constructor(private http: HttpClient) {
        console.log('HttpClient đã được inject:', !!http);
      }
  
  register(user: UserRegistration): Observable<any> {
    const dateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : null;
    const fullName=user.lastName+ " "+ user.firstName;
    const registerData = {
      fullname:fullName,
      email: user.email,
      address:user.address,
      phone_number: user.phone,
      password: user.password,
      retype_password: user.confirmPassword,
      date_of_birth: dateOfBirth,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 3
    };
    // console.log('Register Data:', registerData);

    return this.http.post(`${environment.apiUrl}/users/register`, registerData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}