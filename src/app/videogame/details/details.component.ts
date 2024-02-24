import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Videogame } from '../../interfaces/videogames';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { GameBill } from '../../interfaces/bill';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [FormsModule, FooterComponent, CommonModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
/**Codigo para mostrar los detalles e un videojuego */

  /**Constructor llamando al servicio de juego y a un route para poder navegar */
  constructor(private gameServices: GameService, private route: Router, private authSrevice: AuthService) {}

  @ViewChild('myForm') myForm!: NgForm
  amount : number = 0;
  gameBill: GameBill = {
      idVideogame : 0,
      nameVideogame:"",
      amount: 0,
      price: 0,
      maxStock: 0
  }

  shop: GameBill[] = []
  minStock: number = 0;

  //Variables
  @Input() id!: string //Id del videojuego pasado por ruta
  game! : Videogame //Donde vamos a introducir los datos capturados
  username: any = this.authSrevice.usernameSignal
  rol: any= this.authSrevice.rolSignal

  /**
   * Mtodo que se ejecutara justo al cargar la pagina la primera vez para conseguir
   * los datos del videojuego
   */
  ngOnInit(): void {
    //Comprobamos que nos pasaron la id y no mostramos un mensaje de error
    if(this.id){
      //Hacemos peticion
      this.gameServices.getOne(this.id).subscribe({
        next: (videogame) =>{
          //Si todo es correcto introducimos los datos rescatos a nuestra variable
          this.game = videogame
          this.getMinStock()
        },
        error: (error) => {
          //Si hay erroes se mostrara una alerta con los errores y si le damos a OK nos llevara a
          //la lista de videojuegos
          Swal.fire({
            title: "Error",
            text: error.error.message,
            icon: "error",
            confirmButtonText: "Close",
            confirmButtonColor:"#949494" 
          }).then((respuesta) =>{
            if(respuesta.isConfirmed){
              this.route.navigate(['videogames'])
            }
          })
        }
      })
      
    }else{
      Swal.fire({
        title: "Error",
        text: "Id necesaria en esta ruta",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor:"#949494" 
      }).then((respuesta) =>{
        if(respuesta.isConfirmed){
          this.route.navigate(['videogames'])
        }
      })

    }
  }

  /**
   * Metodo para poder borrar un videojuego desde los detalles pidiendo confirmacion
   * para evitar eliminacion accidentales
   */
  deleteOneGame(){
    //Mostramos alerta para que nos confirmen si queire borrar
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C24042",
      cancelButtonColor: "#949494",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        //Si haepta hacemos peticion para borrar 
        this.gameServices.deleteGame(this.id).subscribe({
          next: (game) =>{
            //Si todo va bien le mostramos un mensaje de exito y lo redirigimos a la lista
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.route.navigate(["videogames"])
            })
          },
          error: (error)=>{
            //Si se produjo algun erro le mostramos una alerta con el mensaje de error corespondiente
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
    });
  }

  /**
   * Metodo para añadir ese articulo al carrito, cogiendo los campos necesarios y comporbando 
   * si ese juego ya estaba anteriromente en el carrito
   */
  addCar(){
    //Miramos que la cantidad no sea 0
    if(this.amount>0){
      //Cogemos los atributos necesarios
      this.gameBill.nameVideogame = this.game.name
      this.gameBill.amount = this.amount,
      this.gameBill.price = this.game.price;
      this.gameBill.maxStock = this.game.stock
      if(this.game.idVideogame){
        this.gameBill.idVideogame = this.game.idVideogame
      }
      //Comprobamos si ya habia algo en el carrito
      if(localStorage.getItem('shop')==null){
        this.shop.push(this.gameBill)
        localStorage.setItem('shop', JSON.stringify(this.shop))
      }else{
        let exist:boolean = false
        this.shop = JSON.parse(localStorage.getItem('shop') || "")
        //Recorremos el carrito a ver si ya existia el jeugo que queremos añadir si ya esite aumentamos la cantidad
        //si no lo añadimos
        for(let i=0; i<this.shop.length && !exist; i++){
          if(this.game.name==this.shop[i].nameVideogame){
            exist = true;
            this.shop[i].amount+= this.amount
          }
        }
        if(!exist){
          this.shop.push(this.gameBill)
        }
        localStorage.setItem('shop', JSON.stringify(this.shop))
      }
      Swal.fire({
        title: "Save!",
        text: "Your file has been added in your basket.",
        icon: "success",
        confirmButtonColor:"#43844B" 
      }).then((resultado)=>{
        this.getMinStock()
        this.amount=0;
        
      })
    }else{
      Swal.fire({
        title: "Error",
        text: "Cant add 0 field",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor:"#949494" 
      });
       
    }
  }

  /**
   * Metodo para obtener el stock maximo de un articulo dependeindo de
   * su stock en base de datos y si tenemos ese juego en la cesta 
   */
  getMinStock(){
    if(localStorage.getItem('shop')!=null){
      let exist: boolean = false
      this.shop = JSON.parse(localStorage.getItem('shop') || "")
      for(let i=0; i<this.shop.length && !exist; i++){
        if(this.game.name==this.shop[i].nameVideogame){
          this.minStock = this.game.stock-this.shop[i].amount
          exist = true
        }
      }
      if(!exist){
        this.minStock = this.game.stock
      }
    }else{
      this.minStock = this.game.stock
    }
  }
}
