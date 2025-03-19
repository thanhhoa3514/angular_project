import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  readonly MIN_AGE = 16;
  readonly MAX_AGE = 100;

  // Kiểm tra độ mạnh của mật khẩu
  checkPasswordStrength(password: string): {
    width: string;
    color: string;
    text: string;
  } {
    // Default
    const result = {
      width: '0%',
      color: '#e5e7eb',
      text: 'Mật khẩu phải có ít nhất 8 ký tự'
    };

    if (!password) return result;

    // Các tiêu chí kiểm tra
    const lengthValid = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Tính điểm
    let score = 0;
    if (lengthValid) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSpecialChars) score += 1;

    // Trả về kết quả dựa trên score
    if (password.length < 8) {
      return {
        width: '10%',
        color: '#ef4444',
        text: 'Mật khẩu quá ngắn'
      };
    } else if (score <= 2) {
      return {
        width: '25%',
        color: '#ef4444',
        text: 'Mật khẩu yếu'
      };
    } else if (score <= 3) {
      return {
        width: '50%',
        color: '#f59e0b',
        text: 'Mật khẩu trung bình'
      };
    } else if (score <= 4) {
      return {
        width: '75%',
        color: '#3b82f6',
        text: 'Mật khẩu mạnh'
      };
    } else {
      return {
        width: '100%',
        color: '#10b981',
        text: 'Mật khẩu rất mạnh'
      };
    }
  }

  // Kiểm tra tuổi
  validateAge(dateOfBirth: Date): { valid: boolean; message: string } {
    if (!dateOfBirth) {
      return { valid: false, message: 'Ngày sinh không được để trống' };
    }
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    // Kiểm tra ngày có hợp lệ không
    if (isNaN(birthDate.getTime())) {
      return { valid: false, message: 'Ngày sinh không hợp lệ' };
    }
    
    // Tính tuổi
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Điều chỉnh tuổi nếu chưa đến sinh nhật trong năm nay
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Kiểm tra tuổi tối thiểu
    if (age < this.MIN_AGE) {
      return { valid: false, message: `Bạn phải đủ ${this.MIN_AGE} tuổi để đăng ký` };
    }
    
    // Kiểm tra tuổi tối đa
    if (age > this.MAX_AGE) {
      return { valid: false, message: `Tuổi không được vượt quá ${this.MAX_AGE}` };
    }
    
    return { valid: true, message: '' };
  }

  // Kiểm tra xác nhận mật khẩu
  passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
}