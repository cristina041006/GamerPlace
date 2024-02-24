import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserLogin } from '../../interfaces/User';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
/*Componente para mostrar el formulario y logeuarse*/

  /**Contructor deonde llamaremos al authService y a Router para poder navegar */
  constructor(private authService: AuthService, private route: Router) {}

  /**Formulario template con los campos de password u username */
  @ViewChild('myForm') myForm!: NgForm

  //Donde almacenaremos los datos del usuario
  userLogin: UserLogin = {
    username: '',
    password: ''
  }

  /**
   * Metodo para comprobar si los cmapos no tienen errores
   * @param field 
   * @returns true si tienen errores false si no
   */
  isValid(field: string){
    return this.myForm?.controls[field]?.invalid && this.myForm.controls[field]?.touched
  }


  /**
   * Metodo para loguearse. Comprobamos que los campos no esten vacios y llamamos al 
   * metodo del authService que nos loegueara, si todo es correcto se redirigira a la pagina de inicio
   * si no se mostrara un error
   */
  login(){    
    if(this.userLogin.password.length!=0 && this.userLogin.username.length!=0){
      this.authService.singin(this.userLogin).subscribe(
        resp=> {
          if(resp===true){
            this.route.navigate([''])
            this.authService.renew();
          }else{
            Swal.fire({
              title: "Error to login",
              text: "User or password incorrect",
              icon: "error",
              confirmButtonText: "Close",
              confirmButtonColor:"#949494" 
            }); 
            
          }
        }
        
      )
    }else{
      Swal.fire({
        title: "Field required",
        text: "User or password incorrect",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor:"#949494" 
      }); 
      
    }
    
  }

}
