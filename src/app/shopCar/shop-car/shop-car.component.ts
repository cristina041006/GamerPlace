import { Component, OnInit } from '@angular/core';
import { GameBill, GameBillBuy } from '../../interfaces/bill';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-shop-car',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-car.component.html',
  styleUrl: './shop-car.component.css'
})
export class ShopCarComponent implements OnInit{
/**Componenete donde vamos a controlar el carrito de la compra y se podra comprara */

  /**Contructor donde llamaremos a los servicios necesarios */
  constructor(private gameService: GameService,private authService: AuthService, private billService: BillService, private route: Router) {}

  //variables
  shop: GameBill[] = [] //lista con los juegos a comprar y susu cantidades
  shopBuy: GameBillBuy[] = [] //lista que vamos a mandar a la hora de comprar
  totlaPrice: number =0; //precio
  value: number = 0 
  maxStok : number=0; //stock maximo de cada producto
  username: any; //nombre del usuario logueado

  /**
   * Metodo que se cargara al cargar el componenete y me almacenara en la variable la cesta que tengo
   * en el localStorage
   */
  ngOnInit(): void {
    if(localStorage.getItem('shop')!=null){
      this.getTotalPrice()
    }
  }

  /**
   * Metodo para obtener el precio total de la factura
   */
  getTotalPrice(){
    this.totlaPrice=0
    this.shop = JSON.parse(localStorage.getItem('shop') || "")
      console.log(this.shop);
      for(let i=0; i<this.shop.length; i++){
        this.totlaPrice+=  this.shop[i].price*this.shop[i].amount
      }
  }

  /**
   * Metodo para quitar los decimales al precio y truncarlo
   * @param amount 
   * @returns 
   */
  truncateNum(amount:number){
    return Math.round(amount*100)/100
  }

  /**
   * Metodo para borra un articulo del carrito, preguntando primero para 
   * evitar borarados inecesarios
   * @param index 
   */
  deleteOne(index: number){
    if(this.shop){
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#C24042",
        cancelButtonColor: "#949494",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if(result.isConfirmed){
          this.shop.splice(index, 1)
          localStorage.setItem('shop', JSON.stringify(this.shop))
          this.getTotalPrice()
        }
      })
     
    }
  }

  /**
   * Metodo para aumentar o disminuir la cantidad de un juego teniendo siempre en cuenta el stock maximo. Cogiendo 
   * la cantidad del valor del imput que hemos cambiado
   * @param index 
   * @param event 
   */
  changeNumber(index:number, event: Event){
    this.maxStok =0;
    const input: HTMLInputElement = <HTMLInputElement>event.target
    this.shop[index].amount = Number(input.value)
    localStorage.setItem('shop', JSON.stringify(this.shop))
    this.getTotalPrice()
    
  }

  /**
   * Metodo para poder comprar. Por cada jeugo de la cesta se creara un gameBill
   * corresponfiente y se añadira a la cesta auxiliar para comprar
   */
  buy(){
    //Creamos la cesta que vamos a mandar la peticion
    this.shop.forEach((gameBill) => {
      const {idVideogame, nameVideogame, amount,...rest} = gameBill
      this.shopBuy.push({idVideogame, nameVideogame, amount})
    })
    //Conseguimos el usuario logueado
    this.authService.renew()
    this.username = this.authService.usernameSignal
    //Si esta logueado
    if(this.username() != ""){
      //Hacemos peticion y compramos
      this.billService.buy(this.shopBuy, this.username()).subscribe({
        next : (bill) =>{
          Swal.fire({
            title: "Save!",
            text: "Your file has been added in your basket.",
            icon: "success",
            confirmButtonColor:"#43844B" 
          }).then((resultado)=>{
            localStorage.removeItem("shop")
            this.route.navigate(["/videogames"])
          })
        },
        error: (error) =>{
          Swal.fire({
            title: "Error to buy",
            text: error.error.message,
            icon: "error",
            confirmButtonText: "Close",
            confirmButtonColor:"#949494" 
          }); 
        }
      })
    }else{
      Swal.fire({
        title: "Error to buy",
        text: "You're not logged",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor:"#949494" 
      }); 
    }
    
    
  }

}
