import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { OAuthCallbackComponent } from './features/auth/oauth-callback/oauth-callback.component';
import { AdminLoginComponent } from './features/auth/admin-login/admin-login.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    component: AdminLoginComponent
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
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES)
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/order/order.routes').then(m => m.ORDER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path:'user-profile',
    loadChildren: () => import('./features/user-profile/user-profile.route').then(m => m.USER_PROFILE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'oauth/callback',
    component: OAuthCallbackComponent
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: ['ADMIN'] }
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./features/errors/access-denied/access-denied.component')
      .then(m => m.AccessDeniedComponent)
  },
  { path: '**', redirectTo: '/' }
];
