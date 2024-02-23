import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const jwtAdminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const logged: boolean = authService.isLogged()
  const admin :boolean= authService.isAdmin()
  const router = inject(Router)
  if(!logged){
    router.navigateByUrl("/login")
    return false
  }else if(!admin){
    router.navigateByUrl("/")
    return false
  }else{
    return true
  }
};
