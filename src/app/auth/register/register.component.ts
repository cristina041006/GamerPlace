import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '../../shared/validators/validators.service';
import { ValidateEmailService } from '../../shared/validators/validate-email.service';
import { ValidateUsernameService } from '../../shared/validators/validate-username.service';
import { User } from '../../interfaces/User';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Cloudinary } from '@cloudinary/url-gen';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private fb: FormBuilder, 
    private validators: ValidatorsService,
    private validateEmail: ValidateEmailService,
    private validateUsername: ValidateUsernameService,
    private authService: AuthService,
    private route: Router,
    private imageService: ImageService){}

  user: User = {
    username: "",
    email:"",
    name:"",
    adderess:"",
    phone:"",
    password:"",
    image:""
  }
  imageUrl: string =''

  myForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]/*, [this.validateUsername]*/],
    email: ['', [Validators.required, Validators.pattern(this.validators.emailPattern)]/*,[this.validateEmail]*/],
    name : ['', [Validators.required, Validators.pattern(this.validators.completeNamePatter)]],
    address: ['', [Validators.required]],
    phone: ['',[ Validators.required, Validators.pattern(this.validators.phonePattern)]],
    password: ['', [Validators.required]],
    passwordComfirm: ['', [Validators.required]],
    image: [''],
  }, {validators: [this.validators.equalsFields('password', 'passwordComfirm')]})


  isValid(field:string){
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  } 

  getFile(event: Event){
    const input: HTMLInputElement = <HTMLInputElement>event.target

    if(input.files && input.files[0]){
      let reader = new FileReader();
      reader.onload =(e:any) => {
        console.log(e.target.result);
        this.imageUrl = e.target.result
      }
      reader.readAsDataURL(input.files[0])
    }

  }

  get usernameErrosMsg():string{
    const errors = this.myForm.get("username")?.errors;
    let errorMsg = "";
    if(this.myForm.get("username")?.touched && errors){
      if(errors['required']){
        errorMsg = "Username is required";
      }else if(errors['usernameTaken']){
        errorMsg = "The username already exist";
      }
    }

    return errorMsg;
  }
  get emailErrosMsg():string{
    const errors = this.myForm.get("email")?.errors;
    let errorMsg = "";
    if(this.myForm.get("email")?.touched && errors){
      if(errors['required']){
        errorMsg = "Email is required";
      }else if(errors['emailTaken']){
        errorMsg = "The email already exist";
      }else if(errors['pattern']){
        errorMsg = "Must be in email format";
      }
    }

    return errorMsg;
  }
  get nameErrosMsg():string{
    const errors = this.myForm.get("name")?.errors;
    let errorMsg = "";
    if(this.myForm.get("name")?.touched && errors){
      if(errors['required']){
        errorMsg = "Name is required";
      }else if(errors['pattern']){
        errorMsg = "Must be in a compleated name";
      }
    }

    return errorMsg;
  }
  get phoneErrosMsg():string{
    const errors = this.myForm.get("phone")?.errors;
    let errorMsg = "";
    if(this.myForm.get("phone")?.touched && errors){
      if(errors['required']){
        errorMsg = "Phone is required";
      }else if(errors['pattern']){
        errorMsg = "Must be 9 digits";
      }
    }

    return errorMsg;
  }

  get passwordErrosMsg():string{
    const errors = this.myForm.get("passwordComfirm")?.errors;
    let errorMsg = "";
    if(this.myForm.get("passwordComfirm")?.touched && errors){
      if(errors['required']){
        errorMsg = "Password is required";
      }else if(errors['nonEquals']){
        errorMsg = "The password mut be the same";
      }
    }

    return errorMsg;
  }

  submit(){
    if(this.myForm.invalid){
      console.log(this.myForm);
      
      this.myForm.markAllAsTouched()
    }else{
      const {passwordComfirm, ...values} = this.myForm.value
      this.user = values;

      this.imageService.uploadFile(this.imageUrl).subscribe((response)=>{
        this.user.image = response.url
        console.log(this.user);
        this.authService.signup(this.user).subscribe({
          next: (userAdd) => {
            Swal.fire({
              title: "Save!",
              text: "Your count has been created.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.route.navigate(['login'])
            })
          },
          error: (error) =>{
            Swal.fire({
              title: "Error",
              text: error.error.message,
              icon: "error",
              confirmButtonText: "Close",
              confirmButtonColor:"#949494" 
            }); 
          }
        })
        
      })

    }
  }

}
