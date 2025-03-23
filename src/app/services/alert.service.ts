import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertConfig {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertConfig | null>(null);
  alert$ = this.alertSubject.asObservable();


  private alertQueue: AlertConfig[] = [];
  private isShowingAlert = false;
  constructor() {}

  showAlert(config: AlertConfig) {
    this.alertQueue.push(config);
    if (!this.isShowingAlert) {
      this.showNextAlert();  
    }
  }
  private showNextAlert() {
    if (this.alertQueue.length === 0) {
      this.isShowingAlert = false;
      return;
    }
    
    this.isShowingAlert = true;
    const nextAlert = this.alertQueue.shift()!;
    this.alertSubject.next(nextAlert);
    
    if (nextAlert.autoClose) {
      setTimeout(() => {
        this.closeAlert();
      }, nextAlert.duration || 5000);
    }
  }
  closeAlert() {
    this.alertSubject.next(null);
    setTimeout(() => {
      this.showNextAlert();
    }, 300);
  }

  // Helper methods
  success(message: string, autoClose = true, duration = 5000) {
    this.showAlert({ message, type: 'success', autoClose, duration });
  }

  error(message: string, autoClose = true, duration = 5000) {
    this.showAlert({ message, type: 'error', autoClose, duration });
  }

  warning(message: string, autoClose = true, duration = 5000) {
    this.showAlert({ message, type: 'warning', autoClose, duration });
  }

  info(message: string, autoClose = true, duration = 5000) {
    this.showAlert({ message, type: 'info', autoClose, duration });
  }
  clearAll() {
    this.alertQueue = [];
    this.alertSubject.next(null);
    this.isShowingAlert = false;
  }
}