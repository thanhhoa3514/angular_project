import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OAuthCallbackComponent } from './oauth-callback/oauth-callback.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'oauth/callback', component: OAuthCallbackComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];