import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verify-cancelled',
  standalone: true,
  imports: [],
  templateUrl: './verify-cancelled.component.html',
  styleUrl: './verify-cancelled.component.css'
})
export class VerifyCancelledComponent  implements OnInit{
/**Componente para poder aceptar o rechazar la cancelacion de la cuenta */

  @Input() username!: string; //username pasado por ruta

  usernameLoggued!: string;

  constructor(private route: Router, private authService: AuthService, private userService: UserService) {}

  /**
   * Metodo que se ejecutara nada mas iniciar el componente y que sera el encargado de saber si 
   * el usuario es el correcto o si acepta o rechaza la peticion
   */
  ngOnInit(): void {
    this.usernameLoggued = this.authService.usernameSignal(); //Rescatamos el username logueado

    //Si el usuario logueado y el que se le pasa no es el mismo entonce se obligara a hacer login
    if(this.usernameLoggued!= "" && this.usernameLoggued == this.username){
      //Pregunra para saber que quiere hacer
      Swal.fire({
        title: "Is the cancellation of your account correct?",
        text: "All data associated with your account will be deleted!",
        icon: "question",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: "#C24042",
        cancelButtonColor: "#949494",
        confirmButtonText: "Yes, I want to cancel!",
        cancelButtonText: "No, is a error"
      }).then((respuesta)=>{
        //Si la respuesta es no la operacion se cancela y se cambia el estado del usuario
        if(respuesta.isDismissed){
          Swal.fire({
            title: "Canceled!",
            text: "The operation has been cancelled, we apologize for the inconvenience.",
            icon: "success",
            confirmButtonColor:"#43844B" 
          }).then((resultado)=>{
            this.userService.modifyStatus(this.username).subscribe({
              next:(user)=>{
                this.route.navigate([""])
              },
              error:(error)=>{
                Swal.fire({
                  title: "Error",
                  text: error.error.error,
                  icon: "error",
                  confirmButtonText: "Close",
                  confirmButtonColor:"#949494" 
                }).then((respuesta)=>{
                  this.route.navigate([""])
                })   
              }
            })
          })
          //Si la respuesta es si, se elimina al usuario de la base de datos
        }else if(respuesta.isConfirmed){
          this.authService.logout()
          Swal.fire({
            title: "Delete!",
            text: "Your account and all its data have been deleted",
            icon: "success",
            confirmButtonColor:"#43844B" 
          }).then((resultado)=>{
            this.userService.deleteUser(this.username).subscribe({
              next:(mesage)=>{
                this.route.navigate([""])
              },
              error:(error)=>{
                Swal.fire({
                  title: "Error",
                  text: error.error.error,
                  icon: "error",
                  confirmButtonText: "Close",
                  confirmButtonColor:"#949494" 
                }).then((respuesta)=>{
                  this.route.navigate([""])
                })      
              }
            })
          })
          
        }
      })
    }else{
      this.authService.logout();
      this.route.navigate([`login/${this.username}`])
    }    
  }

}
