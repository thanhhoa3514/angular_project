import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { 
    path: 'register', 
    component: RegisterComponent,
    title: 'Đăng ký tài khoản'
  },
  { path: 'products/:id', component: DetailProductComponent },
  { path: '**', redirectTo: '' }
];
