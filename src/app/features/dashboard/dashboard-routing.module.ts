import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { OrdersPageComponent } from './components/orders-page/orders-page.component';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
//import { DashboardAuthCheckComponent } from './components/dashboard-auth-check/dashboard-auth-check.component';

const routes: Routes = [
  // Route gốc '/dashboard' - hiển thị Dashboard chính
  {
    path: '',
    component: DashboardComponent
  },
  // Route '/dashboard/admin' - layout chính của trang quản trị
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    // canActivate: [roleGuard(['ADMIN'])], // Tạm thời tắt phân quyền
    children: [
      {
        path: '',
        component: DashboardHomeComponent,
      },
      {
        path: 'orders',
        // component: OrdersPageComponent,
        // canActivate: [roleGuard(['ADMIN'])],
        // data: { roles: ['ADMIN'] }
        component: OrdersPageComponent,

      },
      {
        path: 'products',
        // loadChildren: () => import('./components/products/products.module').then(m => m.ProductsModule),
        // canActivate: [roleGuard(['ADMIN'])],
        // data: { roles: ['ADMIN'] }
        component: ProductListComponent
      },
      {
        path: 'categories',
        component: CategoryListComponent
      },
      {
        path: 'users',
        // loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule),
        // canActivate: [roleGuard(['ADMIN'])],
        // data: { roles: ['ADMIN'] }
        loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
