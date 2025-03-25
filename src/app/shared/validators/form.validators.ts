import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators {
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = regex.test(control.value);
      
      return valid ? null : { email: true };
    };
  }

  static age(minAge: number = 16, maxAge: number = 100): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const birthDate = new Date(control.value);
      const today = new Date();
      
      if (isNaN(birthDate.getTime())) {
        return { invalidDate: true };
      }
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < minAge) {
        return { minAge: { required: minAge, actual: age } };
      }
      
      if (age > maxAge) {
        return { maxAge: { required: maxAge, actual: age } };
      }
      
      return null;
    };
  }

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const password = control.value;
      const lengthValid = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      let score = 0;
      if (lengthValid) score += 1;
      if (hasUppercase) score += 1;
      if (hasLowercase) score += 1;
      if (hasNumbers) score += 1;
      if (hasSpecialChars) score += 1;
      
      if (!lengthValid) {
        return { passwordLength: true };
      }
      
      if (score <= 2) {
        return { passwordWeak: true };
      }
      
      return null;
    };
  }
}