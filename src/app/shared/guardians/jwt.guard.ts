import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const jwtGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const logged: boolean = authService.isLogged()
  const router = inject(Router)
  return !logged? router.navigateByUrl('login') : true
};
