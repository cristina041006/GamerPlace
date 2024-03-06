import { inject } from '@angular/core';
import {  CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

export const jwtUserGuard: CanMatchFn = (route, segments) => {
 /**Guardian que comprueba que para acceder a una ruta debes estar logueado si no te lleva a la pagina de login
   * y si eres venedor si no te manda una alerta
   */
 const authService = inject(AuthService);
 const logged: boolean = authService.isLogged()
 const seller :boolean= authService.isUser()
 const router = inject(Router)
 if(!logged){
   router.navigateByUrl("/login")
   return false
 }else if(!seller){
   Swal.fire({
     title: "Error",
     text: "You are not a user you can't enter",
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
