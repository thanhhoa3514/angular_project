import { Routes } from '@angular/router';
import { CartComponent } from './cart.component';

export const CART_ROUTES: Routes = [
  { 
    path: '', 
    component: CartComponent 
  },
  // Có thể thêm các routes con khác như:
  // { path: 'checkout', component: CheckoutComponent },
  // { path: 'success', component: OrderSuccessComponent },
];