import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../services/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alert-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Alert Component Test</h2>
      
      <div class="settings">
        <div class="form-group">
          <label>Auto Close</label>
          <input type="checkbox" [(ngModel)]="autoClose">
        </div>
        
        <div class="form-group">
          <label>Duration (ms)</label>
          <input type="number" [(ngModel)]="duration" min="1000" step="1000">
        </div>
      </div>
      
      <div class="controls">
        <button (click)="showSuccess()" class="btn-success">Success Alert</button>
        <button (click)="showError()" class="btn-error">Error Alert</button>
        <button (click)="showWarning()" class="btn-warning">Warning Alert</button>
        <button (click)="showInfo()" class="btn-info">Info Alert</button>
        <button (click)="showMultiple()" class="btn-multiple">Show Multiple</button>
        <button (click)="clearAll()" class="btn-clear">Clear All</button>
      </div>
      
      <div class="usage-example">
        <h3>How to use in your components:</h3>
        <pre>
        
        </pre>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Inter', sans-serif;
    }
    
    h2 {
      margin-bottom: 20px;
      color: #333;
    }
    
    .settings {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }
    
    .form-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 30px;
    }
    
    button {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
    }
    
    .btn-success {
      background-color: rgba(0, 200, 83, 0.1);
      color: #00a854;
      border: 1px solid rgba(0, 200, 83, 0.2);
    }
    
    .btn-error {
      background-color: rgba(245, 34, 45, 0.1);
      color: #f5222d;
      border: 1px solid rgba(245, 34, 45, 0.2);
    }
    
    .btn-warning {
      background-color: rgba(250, 173, 20, 0.1);
      color: #faad14;
      border: 1px solid rgba(250, 173, 20, 0.2);
    }
    
    .btn-info {
      background-color: rgba(24, 144, 255, 0.1);
      color: #1890ff;
      border: 1px solid rgba(24, 144, 255, 0.2);
    }
    
    .btn-multiple {
      background-color: rgba(114, 46, 209, 0.1);
      color: #722ed1;
      border: 1px solid rgba(114, 46, 209, 0.2);
    }
    
    .btn-clear {
      background-color: rgba(0, 0, 0, 0.05);
      color: #333;
    }
    
    .usage-example {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      
      h3 {
        margin-bottom: 15px;
        font-size: 18px;
      }
      
      pre {
        background-color: #f1f1f1;
        padding: 15px;
        border-radius: 6px;
        overflow-x: auto;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
      }
    }
  `]
})
export class AlertTestComponent {
  autoClose = true;
  duration = 5000;
  
  constructor(private alertService: AlertService) {}
  
  showSuccess() {
    this.alertService.success('Operation completed successfully!', this.autoClose, this.duration);
  }
  
  showError() {
    this.alertService.error('An error occurred. Please try again.', this.autoClose, this.duration);
  }
  
  showWarning() {
    this.alertService.warning('Warning: This action cannot be undone.', this.autoClose, this.duration);
  }
  
  showInfo() {
    this.alertService.info('Information: The system will be updated tonight.', this.autoClose, this.duration);
  }
  
  showMultiple() {
    this.alertService.success('First alert: Success!', true, 3000);
    setTimeout(() => {
      this.alertService.info('Second alert: Info message', true, 3000);
    }, 300);
    setTimeout(() => {
      this.alertService.warning('Third alert: Warning message', true, 3000);
    }, 600);
    setTimeout(() => {
      this.alertService.error('Fourth alert: Error message', true, 3000);
    }, 900);
  }
  
  clearAll() {
    this.alertService.clearAll();
  }
}