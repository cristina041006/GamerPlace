import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token  = localStorage.getItem('Authorization')
  if(!req.url.includes('cloudinary')){
    if(token){
      authService.renew()
      req = req.clone({
        setHeaders: {Authorization: token}
        
      })
      console.log("Este es el token:",token);
    }

  }
  return next(req);
};
