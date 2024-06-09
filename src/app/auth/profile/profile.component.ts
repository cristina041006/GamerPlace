import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '../../shared/validators/validators.service';
import { AuthService } from '../../services/auth.service';
import { UserEdit, UserPasswordEdit, UserWithLogin } from '../../interfaces/User';
import Swal from 'sweetalert2';
import { ImageService } from '../../services/image.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

   //Variable donde se almacenara la url de la imagen
  imageUrl: string =''
  image: string | null=""
  disabledField: boolean = true
  disabledPassword: boolean = true
  userEdit!: UserEdit;
  userGet!: UserWithLogin;
  userPasswordEdit!: UserPasswordEdit;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private validatorService: ValidatorsService, private authService: AuthService, private imageService: ImageService) {}

  myForm: FormGroup = this.fb.group({
    username: [''],
    name: ['',[Validators.required, Validators.pattern(this.validatorService.completeNamePatter)]],
    email: ['', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required,  Validators.pattern(this.validatorService.phonePattern)]],
    image: [''],
  })

  /**
   * Formulario especial para las contraseñas
   */
  myFormPassword: FormGroup = this.fb.group({
    password: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.pattern(this.validatorService.passwordPattern)]],
    repeatPassword: ['', [Validators.required]]
  }, {validators: [this.validatorService.equalsFields('newPassword', 'repeatPassword')]})


  /**Metodo que comprueba si un campo tiene fallos */
  isValid(field:string){
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
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
   * Metodo que devuelve el mensaje de error del campo repearPassword dependiendo del error
   */
  get passwordComfirmErrosMsg():string{
    const errors = this.myFormPassword.get("repeatPassword")?.errors;
    let errorMsg = "";
    if(this.myFormPassword.get("repeatPassword")?.touched && errors){
      if(errors['required']){
        errorMsg = "Password is required";
      }else if(errors['nonEquals']){
        errorMsg = "The password mut be the same";
      }
    }
    return errorMsg;
  }

  /**
   * Metodo que devuelve el mensaje de error del campo password dependiendo del error
   */
  get passwordErrosMsg():string{
    const errors = this.myFormPassword.get("password")?.errors;
    let errorMsg = "";
    if(this.myFormPassword.get("password")?.touched && errors){
      if(errors['required']){
        errorMsg = "Password is required";
      }else if(errors['pattern']){
        errorMsg = "The password must contain at least one uppercase number and have a length of 8";
      }
    }
    return errorMsg;
  }

  /**
   * Metodo que devuelve el mensaje de error del campo newPassword dependiendo del error
   */
  get newPasswordErrosMsg():string{
    const errors = this.myFormPassword.get("newPassword")?.errors;
    let errorMsg = "";
    if(this.myFormPassword.get("newPassword")?.touched && errors){
      if(errors['required']){
        errorMsg = "Password is required";
      }else if(errors['pattern']){
        errorMsg = "The password must contain at least one uppercase number and have a length of 8";
      }
    }
    return errorMsg;
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
        this.imageUrl = e.target.result
      }
      reader.readAsDataURL(input.files[0])
    }

  }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next:(user)=>{
        this.userGet = user
        this.myForm.reset({
          
          username: this.userGet.username,
          name: this.userGet.name,
          email: this.userGet.email,
          address: this.userGet.address,
          phone: this.userGet.phone,
        })
        this.image = user.image
      },
      error:(error)=>{
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

  activateField(){
    this.disabledField = false
  }

  /**
   * Metodo para volver falsa la variable que se encarga de esconder
   * los campos de contraseña
   */
  activatedPassword(){
    this.disabledPassword = false;
  }
  back(){
    this.disabledField = true;
    this.disabledPassword = true
  }

  edit(){
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched()

    }else{
      this.disabledField = true
      const {password, ...rest} = this.myForm.value
      this.userEdit = rest

      if(this.imageUrl!=""){

        this.imageService.uploadFile(this.imageUrl)
        .subscribe((response)=>{
          this.userEdit.image = response.url,
          
          this.authService.editUser(this.userEdit).subscribe({
            next: (user) =>{
              this.userGet = user
              this.myForm.reset({
                username: this.userGet.username,
                name: this.userGet.name,
                email: this.userGet.email,
                address: this.userGet.address,
                phone: this.userGet.phone,
              })
              this.image = user.image
              Swal.fire({
                title: "Save!",
                text: "Your count has been edit.",
                icon: "success",
                confirmButtonColor:"#43844B" 
              }).then((resultado)=>{
                this.imageUrl=""
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
        this.authService.editUser(this.userEdit).subscribe({
          next: (user) =>{
            this.userGet = user
            this.myForm.reset({
              
              username: this.userGet.username,
              name: this.userGet.name,
              email: this.userGet.email,
              address: this.userGet.address,
              phone: this.userGet.phone,
              image: this.userGet.image
            })
            this.image = user.image
            Swal.fire({
              title: "Save!",
              text: "Your count has been edit.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.imageUrl=""
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

  /**
   * Metodo para poder editar la cotraseña de un usuario sin necesidad de esitar
   * el resto de sus campos
   */
  editPassword(){
    //Cogemos los valores necesarios por formulario
    const {password, newPassword, ...rest} = this.myFormPassword.value
    const {username, ...rest2} = this.myForm.value

    //Miramos que el formulario sea valido
    if(this.myFormPassword.valid){
      Swal.fire({
        title: "Are you sure?",
        text: "Ypur password will change",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#C8A519",
        cancelButtonColor: "#949494",
        confirmButtonText: "Yes, edit it!"
      }).then((result) => {
        if(result.isConfirmed){
          this.userPasswordEdit = {
            username : username,
            oldPassword: password,
            newPassword: newPassword
          }
          //Editamos
          this.authService.editPassword(this.userPasswordEdit).subscribe({
            next: (user) =>{
              Swal.fire({
                title: "Save!",
                text: "Your password has been edit.",
                icon: "success",
                confirmButtonColor:"#43844B" 
              }).then((resultado)=>{
                this.disabledPassword = true
                this.myFormPassword.reset()
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
      })
    }else{
      this.myFormPassword.markAllAsTouched()
    }
  }

}
