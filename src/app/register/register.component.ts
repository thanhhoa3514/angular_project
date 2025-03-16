import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  passwordStrength = {
    width: '0%',
    color: '#e5e7eb',
    text: 'Mật khẩu phải có ít nhất 8 ký tự'
  };

  // Hàm để toggle hiển thị mật khẩu
  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  // Hàm kiểm tra độ mạnh của mật khẩu
  checkPasswordStrength(password: string): void {
    // Reset to default
    this.passwordStrength = {
      width: '0%',
      color: '#e5e7eb',
      text: 'Mật khẩu phải có ít nhất 8 ký tự'
    };

    if (!password) return;

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

    // Hiển thị độ mạnh
    if (password.length < 8) {
      this.passwordStrength = {
        width: '10%',
        color: '#ef4444', // Đỏ
        text: 'Mật khẩu quá ngắn'
      };
    } else if (score <= 2) {
      this.passwordStrength = {
        width: '25%',
        color: '#ef4444', // Đỏ
        text: 'Mật khẩu yếu'
      };
    } else if (score <= 3) {
      this.passwordStrength = {
        width: '50%',
        color: '#f59e0b', // Vàng cam
        text: 'Mật khẩu trung bình'
      };
    } else if (score <= 4) {
      this.passwordStrength = {
        width: '75%',
        color: '#3b82f6', // Xanh dương
        text: 'Mật khẩu mạnh'
      };
    } else {
      this.passwordStrength = {
        width: '100%',
        color: '#10b981', // Xanh lá
        text: 'Mật khẩu rất mạnh'
      };
    }
  }
}
