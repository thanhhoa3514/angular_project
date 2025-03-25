import { Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';

export const ORDER_ROUTES: Routes = [
  { path: '', component: OrderComponent },
  { path: 'confirm', component: OrderConfirmComponent }
];