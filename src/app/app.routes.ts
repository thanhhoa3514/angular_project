import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/product/product.routes').then(m => m.PRODUCT_ROUTES)
  },
  { 
    path: 'cart', 
    loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES) 
  },

  {
    path: 'orders',
    loadChildren: () => import('./features/order/order.routes').then(m => m.ORDER_ROUTES)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
