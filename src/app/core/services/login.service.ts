
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDTO } from '../dtos/user/login.dto';


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private apiUrl = environment.apiUrl; 
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        console.log('HttpClient đã được inject:', !!http);
    }

    // Đăng nhập
    login(loginRequest: LoginDTO): Observable<any> { // Thay đổi kiểu trả về nếu cần
        return this.http.post<any>(`${this.apiUrl}/users/login`, loginRequest, this.httpOptions)
            .pipe(
                catchError(this.handleError) // Xử lý lỗi nếu cần
            );
    }

    // Phương thức xử lý lỗi
    private handleError(error: any): Observable<never> {
        console.error('Đã xảy ra lỗi:', error);
        throw error; // Hoặc xử lý lỗi theo cách khác
    }

}