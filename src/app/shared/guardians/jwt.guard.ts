import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const jwtGuard: CanMatchFn = (route, segments) => {
   /**Guardian que comprueba que para acceder a una ruta debes estar logueado si no te lleva a la pagina de login*/
  const authService = inject(AuthService);
  const logged: boolean = authService.isLogged()
  const router = inject(Router) 
  return !logged? router.navigateByUrl('login') : true
};
