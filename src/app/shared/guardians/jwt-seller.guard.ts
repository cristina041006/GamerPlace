import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

export const jwtSellerGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const logged: boolean = authService.isLogged()
  const seller :boolean= authService.isSeller()
  const router = inject(Router)
  if(!logged){
    router.navigateByUrl("/login")
    return false
  }else if(!seller){
    router.navigateByUrl("/")
    return false
  }else{
    return true
  }
};
