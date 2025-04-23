import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        // Kiểm tra quyền truy cập nếu route yêu cầu
        if (route.data['roles'] && route.data['roles'].length > 0) {
          const userRoles = authService.getUserRoles();
          const hasRequiredRole = route.data['roles'].some((role: string) => 
            userRoles.includes(role)
          );
          
          if (!hasRequiredRole) {
            // Người dùng không có quyền truy cập
            router.navigate(['/unauthorized']);
            return false;
          }
        }
        
        return true;
      }

      // Lưu URL hiện tại để redirect sau khi đăng nhập
      router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    })
  );
};

// Guard kiểm tra quyền admin
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn && authService.getUserRoles().includes('ADMIN')) {
        return true;
      }
      
      router.navigate(['/unauthorized']);
      return false;
    })
  );
};