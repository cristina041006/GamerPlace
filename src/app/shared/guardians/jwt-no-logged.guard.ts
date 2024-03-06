import { inject } from '@angular/core';
import {CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

export const jwtNoLoggedGuard: CanMatchFn = (route, segments) => {
   /**Guardian que comprueba que para acceder a una ruta NO debes estar logueado si no te salta una alerta*/
   const authService = inject(AuthService);
   const logged: boolean = authService.isLogged()
   const router = inject(Router) 
   if(logged){
    Swal.fire({
      title: "Error",
      text: "You are already loggued you can't enter",
      icon: "error",
      confirmButtonText: "Close",
      confirmButtonColor:"#949494" 
    }).then(response=>{
      if(response.isConfirmed){
        router.navigateByUrl("/")
      }
    })
    return false
   }else{
    return true
   }
};
