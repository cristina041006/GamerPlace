import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryWithoutList } from '../../interfaces/categories';
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

}
