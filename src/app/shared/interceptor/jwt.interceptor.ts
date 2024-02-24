import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

/**
 * Interceptor que coger todas las peticiones y le añade la cabecera con el token
 * del usuario que esta logueado. Ademas llama al metodo que actualiza el signal y comprueba que
 * a la peticion de clouidinary no se le ponga la cabecera
 * @param req 
 * @param next 
 * @returns 
 */
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
