import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryWithoutList, CategoryWithoutListSend } from '../../interfaces/categories';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css'
})
export class AdministrationComponent {
/**Componente donde se van a realizar las administraciones de las categorias y las plataformas */

/**Llamamos al servicio de categoria */
  constructor(private categoryService: CategoryService){}

  //Donde vamos a almacenar las catgeorias
  categories!: CategoryWithoutList [];
  categoryName!: string
  idCategory!: number

  /**
   * Metodo para traer todas las categorias de base de datos 
   */
  getCategories(){
    this.categoryService.getAll().subscribe({
      next: (categoriesList) =>{
        this.categories = categoriesList
      }
    })
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
   * Funcion para wue antes de enseñar el modal se guarden en variables 
   * el id y el nombre de la catgeoria seleccionada
   * @param name 
   * @param id 
   */
  showModal(name: string, id: number){
    this.categoryName = name;
    this.idCategory = id;
  }

  /**
   * Funcion para editar una categoria, se comprueba que las variables donde se almacenan sus 
   * datos no este vacia y oregunta si esta seguro de continuar con la modificacion. Si esta seguro
   * se modificara la categoria y se actualizara la lista
   */
  editCategory(){
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
