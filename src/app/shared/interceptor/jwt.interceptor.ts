import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token  = localStorage.getItem('Authorization')
  if(token){
    req = req.clone({
      setHeaders: {Authorization: token}
      
    })
    console.log("Este es el token:",token);
  }
  return next(req);
};
