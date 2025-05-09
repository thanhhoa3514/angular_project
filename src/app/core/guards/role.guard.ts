import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
  
  // Get roles from route data
  const allowedRoles = route.data?.['roles'] || [];
  
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No role restrictions specified
  }
  
  const userRoles = authService.getUserRoles();
  const hasPermission = allowedRoles.some((role: string) => userRoles.includes(role));
  
  if (!hasPermission) {
    router.navigate(['/access-denied']);
    return false;
  }
  
  return true;
}; 