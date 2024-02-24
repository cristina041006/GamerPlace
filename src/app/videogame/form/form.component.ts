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
import { FooterComponent } from '../../shared/footer/footer.component';
import { ImageService } from '../../services/image.service';
import { ValidateNameGameService } from '../../shared/validators/validate-name-game.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe, RouterLink, FooterComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
/**Formulario donde añadiremos o editaremos un videojuego */

  /**Constructor llamando al servicio de catgeoria, platafroma, juego y un formBuilder */
  constructor(private categoryService: CategoryService, 
    private plataformService: PlataformService,
    private fb: FormBuilder,
    private gameService: GameService,
    private imageService: ImageService,
    private validateService: ValidateNameGameService){}

  //Variables
  @Input() id!: string; //Id del videojuego si vamos a editar
  categories: CategoryWithoutList[] = [] //Donde almacenaremos las catgeorias
  plataform: PlataformWithoutList[] = [] //Donde almacenaremos las plataformas
  //Videojuego con algunos campos utilizado para poder añadir
  videogame : Omit<Videogame, "quality" | "namePlataform" | "idUser" | "username" | "deletGame" | "listCategory" > = {
    name: "",
    description: "",
    price: 1,
    stock: 0,
    idPlataform: 1,
    image:""
  }
  categoriesAdd: string[] = [] //Donde almacenaremos las catgeorias que vamos a añadir
  imageUrl: string =""//Donde alamcenaremos la imagen que vamos a añadir 
  videogameEdit!: Videogame //Videojuego con todos sus campos utilizado para editar
  
  //FormControl donde iran rotando las categorias seleccionadas para añadirlas a la lista
  newCategory : FormControl = this.fb.control('', Validators.required)

  //Datos del formulario
  myForm: FormGroup = this.fb.group({
    idVideogame: [''],
    name: ['',[Validators.required],[this.validateService]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(1)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    idPlataform: ['', [Validators.required]],
    //Lista de catgeorias
    categoriesList: this.fb.array([
    ], Validators.required),
    image: ['']
  })

  /**
   * Metod para sacar los distintos mensajes de error del precio
   */
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

  /**
   * Metod para sacar los distintos mensajes de error del stock
   */
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

  get nameErrorsMsg():string{
    const errors = this.myForm.get('name')?.errors;
    let errorMsg= "";
    if(this.myForm.get('name')?.touched && errors){
      if(errors['required']){
        errorMsg = "The name is required"
      }else if(errors['nameTaken']){
        errorMsg = "The name game is already exist"
      }
    }
    return errorMsg;
  }
  /**
   * Metodo para poder acceder a las catgeorias mas facilmente tratandolas como un FromArray 
   */
  get categoriesList(){
    return this.myForm.get('categoriesList') as FormArray
  }

  /**
   * Metodo que se ejecutara cada vez que se carge la pagina, donde rescatamos las catgeorias 
   * las plataformas y si estamso editando nos recupera el videojuego al cual
   * pertenece la id pasada
   */
  ngOnInit(): void {
    //Recuperamos las categorias
    this.categoryService.getAll().subscribe({
      next: (category) => {
        this.categories = category
      }
    })
    //Recuperamos las plataformas
    this.plataformService.getAll().subscribe({
      next: (plat) =>{
        this.plataform = plat
      }
    })
    
    //Si estamos editando hacemos peticion para averiguar cual es el videojuego
    if(this.id){
      this.gameService.getOne(this.id).subscribe({
        next: (game) =>{
          //Si todo va bien tendremos que ir rellenando uno a uno los datos del formulario con
          //los rescatados
          this.videogameEdit = game;
          this.myForm.get('idVideogame')?.setValue(this.videogameEdit.idVideogame)
          this.myForm.get('name')?.setValue(this.videogameEdit.name)
          this.myForm.get('description')?.setValue(this.videogameEdit.description)
          this.myForm.get('price')?.setValue(this.videogameEdit.price)
          this.myForm.get('stock')?.setValue(this.videogameEdit.stock)
          this.myForm.get('idPlataform')?.setValue(this.videogameEdit.idPlataform)
          //Para las catgeorias debemos usar el FromControl auxiliar creado anteriormente  
          for(let categ of this.videogameEdit.listCategory){
            this.newCategory.setValue(categ.nameCategory)
            this.categoriesList.push(this.fb.control(this.newCategory.value, Validators.required))
          }
        }
      })
    }
  }

  /**
   * Metodo para saber si un parametro tiene errores cuando ya lo hemos tocados por primera vez 
   * @param field 
   * @returns true si tiene errores, false si no
   */
  isValid(field:string){
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  }

  /**
   * Metodo para añadir un videojuego a la base de dato o editarlo comprobando is hay algun 
   * error y mostrandolo
   */
  addGame(){
    //Si el formulario no tiene errores
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
    }else{
      //Hacemos desestructuracion para sacar los datos que no nos interesan para añadir y editar
      //o los que necesitamos aislados
      const {categoriesList, idVideogame,...rest} = this.myForm.value
      this.videogame = rest;      
      this.categoriesAdd = categoriesList
    
      //Si no etamos editando hacemos peticion para poder añadir pasandole el juego, las catgeorias y la imagen
      if(!this.id){
        if(this.imageUrl!=""){
          this.imageService.uploadFile(this.imageUrl).subscribe((response)=>{
            this.videogame.image = response.url
            console.log(this.videogame);
            this.gameService.addNewGame(this.videogame, this.categoriesAdd).subscribe({
              next: (game) =>{
                //Si todo va bien mostramos alerta exitosa y reseteamos el fromualrio
                Swal.fire({
                  title: "Save!",
                  text: "Your file has been save.",
                  icon: "success",
                  confirmButtonColor:"#43844B" 
                }).then((resultado)=>{
                  this.categoriesList.clear()
                  this.myForm.reset()
                  this.imageUrl="";
                })
              },
              error: (error)=>{
                //Si hay algun error se los mostramos con el mensaje correspondiente
                Swal.fire({
                  title: "Error al añadir",
                  text: error.error.message,
                  icon: "error",
                  confirmButtonText: "Close",
                  confirmButtonColor:"#949494" 
                }); 
                
              }
            })
            
          })

        }else{

          this.gameService.addNewGame(this.videogame, this.categoriesAdd).subscribe({
            next: (game) =>{
              //Si todo va bien mostramos alerta exitosa y reseteamos el fromualrio
              Swal.fire({
                title: "Save!",
                text: "Your file has been save.",
                icon: "success",
                confirmButtonColor:"#43844B" 
              }).then((resultado)=>{
                this.categoriesList.clear()
                this.myForm.reset()
                this.imageUrl="";
              })
            },
            error: (error)=>{
              //Si hay algun error se los mostramos con el mensaje correspondiente
              Swal.fire({
                title: "Error al añadir",
                text: error.error.message,
                icon: "error",
                confirmButtonText: "Close",
                confirmButtonColor:"#949494" 
              }); 
              
            }
          })

        }

      }else{
        //Si estamos editando mostramos mensaje de alerta para que nos confirme que quiere editar
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
          //Si acepta hacemos peticion para editar pasnaodle el id del juego, el juego
          //las catgeorias y la imagen 
          this.videogame.idVideogame = idVideogame;
          if(this.imageUrl!=""){
            this.imageService.uploadFile(this.imageUrl).subscribe((response)=>{
              this.videogame.image = response.url
              this.gameService.editGame(this.videogame, this.categoriesAdd, this.id).subscribe({
                next: (game) =>{
                  //Si todo va bien mostranmos una alerta de exito
                  Swal.fire({
                    title: "Save!",
                    text: "Your file has been edit.",
                    icon: "success",
                    confirmButtonColor:"#43844B" 
                  })
                },
                error: (error)=>{
                  //Si hay algun erroe mostramos un mensaje de alerta con el error correspondiente
                  Swal.fire({
                    title: "Error al editar",
                    text: error.error.message,
                    icon: "error",
                    confirmButtonText: "Close",
                    confirmButtonColor:"#949494" 
                  }); 
                  
                }
                })
            })

          }else{
            this.gameService.editGame(this.videogame, this.categoriesAdd, this.id).subscribe({
              next: (game) =>{
                //Si todo va bien mostranmos una alerta de exito
                Swal.fire({
                  title: "Save!",
                  text: "Your file has been edit.",
                  icon: "success",
                  confirmButtonColor:"#43844B" 
                })
              },
              error: (error)=>{
                //Si hay algun erroe mostramos un mensaje de alerta con el error correspondiente
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
          }
        })
      }   

      
    }
  }

  /**
   * Metodo para añadir una catgoeria a la lista de catgeorias
   */
  addCategory(){
    //Si el campo no esta vacio
    if(this.newCategory.valid){
      //Comprobamos que esa catgeoria no este
      if(!this.categoriesList.value.includes(this.newCategory.value)){
        //Si no esta lo añadimos a la lista de categorias del formulario
        this.categoriesList.push(this.fb.control(this.newCategory.value, Validators.required))
        this.newCategory.reset()
      }else{
        //Si esta mostramos mensaje de alerta
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

  /**
   * Metod para borrar la catgeorias que seleccionemos segun el indice
   * @param i 
   */
  deleteCategory(i: number){
    this.categoriesList.removeAt(i);
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

}
