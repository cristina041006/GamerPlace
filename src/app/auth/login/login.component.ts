import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserLogin } from '../../interfaces/User';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private route: Router) {}

  @ViewChild('myForm') myForm!: NgForm
  userLogin: UserLogin = {
    username: '',
    password: ''
  }


  isValid(field: string){
    return this.myForm?.controls[field]?.invalid && this.myForm.controls[field]?.touched
  }

  login(){    
    if(this.userLogin.password.length!=0 && this.userLogin.username.length!=0){
      this.authService.singin(this.userLogin).subscribe(
        resp=> {
          if(resp===true){
            this.route.navigate([''])
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
      console.log("no");
      
    }
    
  }

}
