import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '../../shared/validators/validators.service';
import { AuthService } from '../../services/auth.service';
import { UserEdit, UserWithLogin } from '../../interfaces/User';
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
  userEdit!: UserEdit;
  userGet!: UserWithLogin;
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
          image: this.userGet.image
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

    console.log(this.myForm);
    
  }

  activateField(){
    this.disabledField = false
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
          this.loading= true
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

}
