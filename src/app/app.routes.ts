import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailProductComponent } from './detail-product/detail-product.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products/:id', component: DetailProductComponent },
  { path: '**', redirectTo: '' }
];
