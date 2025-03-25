import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('fadeInOut', [
      // Entry animation - slide in from right with fade
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateX(30px)' 
        }),
        animate('300ms ease-out', 
          style({ 
            opacity: 1, 
            transform: 'translateX(0)' 
          })
        )
      ]),
      // Exit animation - fade out with slight movement
      transition(':leave', [
        animate('300ms ease-in', 
          style({ 
            opacity: 0, 
            transform: 'translateX(30px)' 
          })
        )
      ])
    ])
  ]
})
export class AlertComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() autoClose: boolean = true;
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
    }, 300); // Allow animation to complete
  }
}
