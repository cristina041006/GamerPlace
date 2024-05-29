import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryAdd, CategoryWithoutList, CategoryWithoutListSend } from '../../interfaces/categories';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ValidateCategoryNameService } from '../../shared/validators/validate-category-name.service';
import { AddPlataform, PlataformWithoutList } from '../../interfaces/plataform';
import { PlataformService } from '../../services/plataform.service';
import { ValidatePlataformNameService } from '../../shared/validators/validate-plataform-name.service';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css'
})
export class AdministrationComponent {
/**Componente donde se van a realizar las administraciones de las categorias y las plataformas */

/**Llamamos al servicio de categoria */
  constructor(private categoryService: CategoryService, private fb: FormBuilder,
    private validateCategoryName: ValidateCategoryNameService,
    private plataformService: PlataformService,
    private validatePlataformName: ValidatePlataformNameService
  ){}

  //Donde vamos a almacenar las catgeorias
  categories!: CategoryWithoutList [];
  //Donde vamos a almacenar las plataformas
  plataforms!: PlataformWithoutList []
  //nombre de la nueva categoria
  categoryName!: string
  //nombre de la nueva plataforma
  plataformName!: string
  idCategory!: number
  addCategory: boolean = false;
  addPlataform: boolean = false;
  showCategory: boolean = false;
  showPlataform: boolean = false;
  updateCategory: boolean = false;

  /**Nuestro formulario con las variables correspondientes */
  myForm: FormGroup = this.fb.group({
    idCategory: [''],
    nameCategory: ['', ,[this.validateCategoryName]],
    idPlataform: [''],
    namePlataform: ['', ,[this.validatePlataformName]]
  })

  /**
   * Metodo para saber si un parametro tiene errores cuando ya lo hemos tocados por primera vez 
   * @param field 
   * @returns true si tiene errores, false si no
   */
  isValid(field:string){
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  }

  /**
   * Metodo para traer todas las categorias de base de datos 
   */
  getCategories(){
    this.showPlataform = false;
    this.showCategory = true
    this.categoryService.getAll().subscribe({
      next: (categoriesList) =>{
        this.categories = categoriesList
      }
    })
  }

  /**
   * Metoso para traer todas las plataformas de la base de datos
   */
  getPlataform(){
    this.showCategory = false
    this.showPlataform = true;
    this.plataformService.getAll().subscribe({
      next: (plataform) => {
        this.plataforms = plataform
      }
    })

  }

  /**
   * Metodo para añadir una nueva categoria a la base de datos
   * comprobando antes que no tenga errores
   */
  addNewCategory(){
    console.log(this.myForm);
    if(this.myForm.get("nameCategory")?.valid){
      const newCategory: CategoryAdd = {
        nameCategory : this.myForm.get("nameCategory")?.value
      }
      console.log(newCategory);
      
      this.categoryService.addCategory(newCategory).subscribe({
        next: (category) => {
          Swal.fire({
            title: "Added!",
            text: "Your file has been added.",
            icon: "success",
            confirmButtonColor:"#43844B" 
          }).then((resultado)=>{
            this.getCategories()
          })
        },
        error: (error) => {
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

  addNewPlataform(){
    if(this.myForm.get("namePlataform")?.valid){
      const newPlataform: AddPlataform = {
        name : this.myForm.get("namePlataform")?.value
      }      
      this.plataformService.addPlataform(newPlataform).subscribe({
        next: (plataform) => {
          Swal.fire({
            title: "Added!",
            text: "Your file has been added.",
            icon: "success",
            confirmButtonColor:"#43844B" 
          }).then((resultado)=>{
            this.getPlataform()
          })
        },
        error: (error) => {
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

  /**
   * Metodo para borrar una catgeoria dependiendo del id que le pasamos
   * Preguntara antes de borrar para evitar accidentes 
   * @param id 
   */
  deleteCategory(id: number){

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C24042",
      cancelButtonColor: "#949494",
      confirmButtonText: "Yes, delete it!"
    }).then((response)=>{
      if(response.isConfirmed){
        this.categoryService.deleteCategory(id).subscribe({
          next: ()=>{
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.getCategories()
            })
          },
          error: (error) =>{
            console.log(error);
            
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
  }

  /**
   * Metodo para borra la plataforma que corresponde a la id que le pasamos, se 
   * pregunta antes de borrar y cuando se borra se vuelven a listar las plataformas
   * @param id 
   */
  deletePlataform(id: number){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C24042",
      cancelButtonColor: "#949494",
      confirmButtonText: "Yes, delete it!"
    }).then((response)=>{
      if(response.isConfirmed){
        this.plataformService.deletePlataform(id).subscribe({
          next: ()=>{
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.getPlataform()
            })
          },
          error: (error) =>{
            console.log(error);
            
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
  }

  /**
   * Funcion para wue antes de enseñar el modal se guarden en variables 
   * el id y el nombre de la catgeoria seleccionada
   * @param name 
   * @param id 
   */
  showModalEdit(name: string, id: number){
    this.myForm.get('nameCategory')?.setValue(name)
    this.myForm.get('idCategory')?.setValue(id)
    this.categoryName = name;
    this.idCategory = id;
    this.addCategory=false
    this.updateCategory = true;
  }

  /**
   * Funcion para mostrar el modal cuando se esta añadiendo
   * poniendo los campos del formulario vacios
   */
  showModalAddCategory(){
    this.addPlataform = false
    //this.idCategory = 0;
    this.plataformName = "";
    this.myForm.get('nameCategory')?.setValue("")
    this.myForm.get('idPlataform')?.setValue(0)
    this.updateCategory=false
    this.addCategory = true;
  }

  showModalAddPlataform(){
    this.addCategory = false
    this.plataformName = "";
    this.myForm.get('namePlataform')?.setValue("")
    this.myForm.get('')?.setValue(0)
    //this.updateCategory=false
    this.addPlataform = true;
  }

  /**
   * Funcion para editar una categoria, se comprueba que las variables donde se almacenan sus 
   * datos no este vacia y oregunta si esta seguro de continuar con la modificacion. Si esta seguro
   * se modificara la categoria y se actualizara la lista
   */
  editCategory(){
    this.updateCategory = true;
    this.categoryName = this.myForm.get("nameCategory")?.value
    this.idCategory = this.myForm.get("idCategory")?.value
    if(this.categoryName && this.categoryName!=="" && this.idCategory){
      const newCategoryEdit: CategoryWithoutListSend = {
        id_category : this.idCategory,
        name: this.categoryName
      }
      Swal.fire({
        title: "Are you sure?",
        text: "The category will be modify!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#C8A519",
        cancelButtonColor: "#949494",
        confirmButtonText: "Yes, edit it!"
      }).then((response)=>{
        if(response.isConfirmed){
          this.categoryService.editCategory(newCategoryEdit, this.idCategory).subscribe({
            next: ()=>{
              Swal.fire({
                title: "Edit!",
                text: "Your file has been modify.",
                icon: "success",
                confirmButtonColor:"#43844B" 
              }).then((resultado)=>{
                this.getCategories()
              })
            },
            error: (error) =>{
              console.log(error);
              
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
      Swal.fire({
        title: "Error",
        text: "Id and name needed",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor:"#949494" 
      });   
    }
  }

}
