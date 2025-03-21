import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true, 
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  imports: [CommonModule] ,
  animations: [
    trigger('fadeInOut', [
      state('true', 
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      state('false', 
        style({
          opacity: 0,
          transform: 'translateY(-10px)'
        })
      ),
      transition('false => true', [
        animate('300ms ease-out')
      ]),
      transition('true => false', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() autoClose: boolean = false;
  @Input() duration: number = 5000;
  @Output() closed = new EventEmitter<void>();
  
  visible: boolean = true;
  
  ngOnInit() {
    if (this.autoClose) {
      setTimeout(() => {
        this.closeAlert();
      }, this.duration);
    }
  }
  
  get alertClass() {
    return `alert-${this.type}`;
  }
  
  closeAlert() {
    this.visible = false;
    setTimeout(() => {
      this.closed.emit();
    }, 300); // Cho phép animation hoàn thành
  }
}
