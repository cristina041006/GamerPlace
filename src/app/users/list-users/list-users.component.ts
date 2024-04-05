import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserGetList } from '../../interfaces/User';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit{
/**Codigo para listar a todos los usuarios */

/**Constructor llamando a userServices para traer sus metodos */
  constructor(private userService: UserService, private route: Router){}

  //Variables
  listUsers: UserGetList[] = [] //Donde se almacenaran todos los usuarios encontrados
  term!: string; //Conjunto de letras por el cual se va a buscar al usuario

  /**
   * Funcion que se va a ejecutar cada vez que se inice el componente y que va a llamar
   * a la funcion que trae todos los usuarios
   */
  ngOnInit(): void {
    this.getUsers()
  }

  /**
   * Funcion para poder buscar al usuario por su username o su email haciendo una peticion
   * con el metodo de userServices. 
   * Si el termino esta vacio o undefined se mostraran otra vez todos los usuarios
   */
  findUser(){
    if(this.term && this.term!==""){
      this.userService.filterUser(this.term).subscribe({
        next: (user) =>{
          this.listUsers = user
        }
      })
    }else{
      this.getUsers()
    }
  }

  /**
   * Funcion para traer a todos los usuarios normales y vendedores de la base de datos
   */
  getUsers(){
    this.userService.getAllUser().subscribe({
      next: (users) => {
        this.listUsers = users
      },
      error: (error) => {
        Swal.fire({
          title: "Error",
          text: "There was an error retrieving data, try again later",
          icon: "error",
          confirmButtonText: "Close",
          confirmButtonColor:"#949494" 
        }).then((respuesta) =>{
          if(respuesta.isConfirmed){
            this.route.navigate(['/'])
          }
        })
      }
    })
  }


}
