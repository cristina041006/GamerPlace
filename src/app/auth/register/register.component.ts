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
import { delay, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
/**Componenete donde vamos a mostrar el formulario para que se registre un nuevo usuario */

  /**Constructor donde llamaremos a los servicios */
  constructor(private fb: FormBuilder, 
    private validators: ValidatorsService,
    private validateEmail: ValidateEmailService,
    private validateUsername: ValidateUsernameService,
    private authService: AuthService,
    private route: Router,
    private imageService: ImageService){}

  //Variable donde se almacenara la informacion del usuario  
  user: User = {
    username: "",
    email:"",
    name:"",
    adderess:"",
    phone:"",
    password:"",
    image:""
  }
  //Variable donde se almacenara la url de la imagen
  imageUrl: string =''

  loading: boolean = false

  /**Formulario reactivo con los campos correspondientes para crear un usuario y sus respectivas 
   * validaciones
   */
  myForm: FormGroup = this.fb.group({
    username: ['', [Validators.required], [this.validateUsername]],
    email: ['', [Validators.required, Validators.pattern(this.validators.emailPattern)],[this.validateEmail]],
    name : ['', [Validators.required, Validators.pattern(this.validators.completeNamePatter)]],
    address: ['', [Validators.required]],
    phone: ['',[ Validators.required, Validators.pattern(this.validators.phonePattern)]],
    password: ['', [Validators.required, Validators.pattern(this.validators.passwordPattern)]],
    passwordComfirm: ['', [Validators.required]],
    image: [''],
  }, {validators: [this.validators.equalsFields('password', 'passwordComfirm')]})


  /**Metodo que comprueba si un campo tiene fallos */
  isValid(field:string){
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  } 

  /**
   * Metodo para poder extraer la verdadera url de la imagen que 
   * hemos seleccionado e introducirsela a la variable imageUrl
   * @param event 
   */
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

  /**
   * Metodo que devuelve el mensaje de error del campo username dependiendo del error
   */
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

  /**
   * Metodo que devuelve el mensaje de error del campo email dependiendo del error
   */
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

  /**
   * Metodo que devuelve el mensaje de error del campo name dependiendo del error
   */
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

  /**
   * Metodo que devuelve el mensaje de error del campo phone dependiendo del error
   */
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

  /**
   * Metodo que devuelve el mensaje de error del campo passwordComfirm dependiendo del error
   */
  get passwordComfirmErrosMsg():string{
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

  /**
   * Metodo que devuelve el mensaje de error del campo passwordComfirm dependiendo del error
   */
  get passwordErrosMsg():string{
    const errors = this.myForm.get("password")?.errors;
    let errorMsg = "";
    if(this.myForm.get("password")?.touched && errors){
      if(errors['required']){
        errorMsg = "Password is required";
      }else if(errors['pattern']){
        errorMsg = "The password must contain at least one uppercase number and have a length of 8";
      }
    }
    return errorMsg;
  }

  /**
   * Metodo para añadir al usuario, comprobando si el usuario es valido, si estamos añadiendo imagen o no
   * y capturando los errores para mostrarlos
   */
  submit(){
    //Comprobamos que el formualrio es valido
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched()
    }else{
      this.loading=true
      //Quitamos el campo que no nos hace falta
      const {passwordComfirm, ...values} = this.myForm.value
      this.user = values;
      //Comprobamos si vamos a añadir imagen
      if(this.imageUrl!=""){
        
        this.imageService.uploadFile(this.imageUrl).pipe(
          tap( iamge=>{
              this.loading= true
            }
          ),
        )
        .subscribe((response)=>{
          this.user.image = response.url
          console.log(this.user);
          this.authService.signup(this.user).pipe(
            tap( user => {
              this.loading=true 
            }), 
          )
          .subscribe({
            next: (userAdd) => {
              Swal.fire({
                title: "Save!",
                text: "Your count has been created.",
                icon: "success",
                confirmButtonColor:"#43844B" 
              }).then((resultado)=>{
                this.imageUrl=""
                this.loading = false
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

      }else{
        this.authService.signup(this.user).pipe(
          tap( user => {
            this.loading=true 
          }) 
        )
        .subscribe({
          next: (userAdd) => {
            Swal.fire({
              title: "Save!",
              text: "Your count has been created.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.imageUrl=""
              this.loading = false
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

      }

    }
  }

}
