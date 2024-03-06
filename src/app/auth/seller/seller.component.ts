import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from '../../interfaces/User';
import Swal from 'sweetalert2';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [FormsModule, FooterComponent],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.css'
})
export class SellerComponent {
/**Componente donde se mostrara un formulario para 
 * que el usuario se convierta en un usuario vendedor
 */

  /**Contructor deonde llamaremos al authService y a Router para poder navegar */
  constructor(private authService: AuthService, private route: Router) {}

  /**Formulario template con los campos de password u username */
  @ViewChild('myForm') myForm!: NgForm

  userSeller: UserLogin = {
    username: "",
    password: ""
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
   * Merodo para convertirse en usuario vendedor. 
   * Preguntara primero una confirmacion y si acepta se hara la peticion para
   * cambiar su rol a userSeller y tener sus ventajas
   */
  become(){    
    if(this.userSeller.username!="" && this.userSeller.password!=""){
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#43844B",
        cancelButtonColor: "#949494",
        confirmButtonText: "Yes!"
      }).then((result) => {
        if(result.isConfirmed){
          this.authService.becomeAseller(this.userSeller).subscribe((response)=>{
            if(response==true){
              Swal.fire({
                title: "Congratilation!",
                text: "Now you're a user seller, enjoy the benefits",
                icon: "success",
                confirmButtonColor:"#43844B" 
              }).then((resultado)=>{
                this.route.navigate(["/"])
              })
            }else{
              console.log(response);
              Swal.fire({
                title: "Error",
                text: response.error.message,
                icon: "error",
                confirmButtonText: "Close",
                confirmButtonColor:"#949494" 
              }); 
              
            }
          })
        }
      })
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
