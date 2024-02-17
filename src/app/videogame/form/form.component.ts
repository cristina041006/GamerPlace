import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryWithoutList } from '../../interfaces/categories';
import { CommonModule, JsonPipe } from '@angular/common';
import { PlataformWithoutList } from '../../interfaces/plataform';
import { PlataformService } from '../../services/plataform.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { Videogame, ListCategoryGame } from '../../interfaces/videogames';
import { GameService } from '../../services/game.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe, RouterLink],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  constructor(private categoryService: CategoryService, 
    private plataformService: PlataformService,
    private fb: FormBuilder,
    private gameService: GameService){}

  @Input() id!: string;
  categories: CategoryWithoutList[] = []
  plataform: PlataformWithoutList[] = []
  videogame : Omit<Videogame, "quality" | "namePlataform" | "idUser" | "username" | "deletGame" | "listCategory" | "image"> = {
    name: "",
    description: "",
    price: 1,
    stock: 0,
    idPlataform: 1,
  }
  categoriesAdd: string[] = []
  imageAdd!: File
  videogameEdit!: Videogame
  
  newCategory : FormControl = this.fb.control('', Validators.required)

  myForm: FormGroup = this.fb.group({
    idVideogame: [''],
    name: ['',[Validators.required]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(1)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    idPlataform: ['', [Validators.required]],
    categoriesList: this.fb.array([
    ], Validators.required),
    image: [this.imageAdd]
  })

  get priceErrorsMsg():string{
    const errors = this.myForm.get('price')?.errors;
    let errorMsg= "";
    if(this.myForm.get('price')?.touched && errors){
      if(errors['required']){
        errorMsg = "El precio no puede estar vacio"
      }else if(errors['min']){
        errorMsg = "El precio tiene que ser mayor a 0"
      }
    }
    return errorMsg;
  }

  get stockErrorsMsg():string{
    const errors = this.myForm.get('stock')?.errors;
    let errorMsg= "";
    if(this.myForm.get('stock')?.touched && errors){
      if(errors['required']){
        errorMsg = "El stock no puede estar vacio"
      }else if(errors['min']){
        errorMsg = "El stock tiene que ser mayor o igual a 0"
      }
    }
    return errorMsg;
  }


  get categoriesList(){
    return this.myForm.get('categoriesList') as FormArray
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (category) => {
        this.categories = category
      }
    })
    this.plataformService.getAll().subscribe({
      next: (plat) =>{
        this.plataform = plat
      }
    })
    
    if(this.id){
      this.gameService.getOne(this.id).subscribe({
        next: (game) =>{
          this.videogameEdit = game;
          console.log(this.myForm.controls['name']);
          this.myForm.get('idVideogame')?.setValue(this.videogameEdit.idVideogame)
          this.myForm.get('name')?.setValue(this.videogameEdit.name)
          this.myForm.get('description')?.setValue(this.videogameEdit.description)
          this.myForm.get('price')?.setValue(this.videogameEdit.price)
          this.myForm.get('stock')?.setValue(this.videogameEdit.stock)
          this.myForm.get('idPlataform')?.setValue(this.videogameEdit.idPlataform)  
          for(let categ of this.videogameEdit.listCategory){
            this.newCategory.setValue(categ.nameCategory)
            this.categoriesList.push(this.fb.control(this.newCategory.value, Validators.required))
          }
        }
      })
    }
  }

  isValid(field:string){
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  }

  addGame(){
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
    }else{
      const {categoriesList, image, idVideogame,...rest} = this.myForm.value
      this.videogame = rest;      
      this.categoriesAdd = categoriesList
      this.imageAdd = image 
      if(!this.id){
        this.gameService.addNewGame(this.videogame, this.imageAdd, this.categoriesAdd).subscribe({
          next: (game) =>{
            Swal.fire({
              title: "Save!",
              text: "Your file has been save.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.myForm.reset()
            })
          },
          error: (error)=>{
            Swal.fire({
              title: "Error al añadir",
              text: error.error.message,
              icon: "error",
              confirmButtonText: "Close",
              confirmButtonColor:"#949494" 
            }); 
            
          }
        })

      }else{
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#C8A519",
          cancelButtonColor: "#949494",
          confirmButtonText: "Yes, edit it!"
        }).then((result) => {
          if (result.isConfirmed) {
          this.videogame.idVideogame = idVideogame;
          this.gameService.editGame(this.videogame, this.imageAdd, this.categoriesAdd, this.id).subscribe({
            next: (game) =>{
              Swal.fire({
                title: "Save!",
                text: "Your file has been edit.",
                icon: "success",
                confirmButtonColor:"#43844B" 
              }).then((resultado)=>{
                
              })
            },
            error: (error)=>{
              Swal.fire({
                title: "Error al editar",
                text: error.error.message,
                icon: "error",
                confirmButtonText: "Close",
                confirmButtonColor:"#949494" 
              }); 
              
            }
            })
          }
        })
      }   

      
    }
  }

  addCategory(){
    console.log(this.newCategory);
    if(this.newCategory.valid){
      if(!this.categoriesList.value.includes(this.newCategory.value)){
        this.categoriesList.push(this.fb.control(this.newCategory.value, Validators.required))
        this.newCategory.reset()
      }else{
        this.newCategory.reset()  
        Swal.fire({
          title: "Campo duplicado",
          text: "Esa categoria ya esta en la lista",
          icon: "error",
          confirmButtonText: "Close",
          confirmButtonColor:"#949494" 
        }); 
      }
    }
    
  }

  deleteCategory(i: number){
    this.categoriesList.removeAt(i);
  }

}
