import { Component } from '@angular/core';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    OrderConfirmComponent
  
  
  ],
  template: '<app-order-confirm></app-order-confirm>'
})
export class AppComponent {
  title = 'shopapp-angular';
}
