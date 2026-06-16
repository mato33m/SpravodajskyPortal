import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    const user = auth.currentUser();
    const userRole = user?.role?.toUpperCase();
    const allowed = allowedRoles.map(r => r.toUpperCase());

    if (!user || !userRole || !allowed.includes(userRole)) {
      router.navigate(['/articles']);
      return false;
    }

    return true;
  };
};
