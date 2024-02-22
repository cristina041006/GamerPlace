import { Component, OnInit } from '@angular/core';
import { GameBill, GameBillBuy } from '../../interfaces/bill';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  constructor(private gameService: GameService,private authService: AuthService, private billService: BillService) {}

  shop: GameBill[] = []
  shopBuy: GameBillBuy[] = []
  totlaPrice: number =0;
  value: number = 0
  maxStok : number=0;
  username: any;

  ngOnInit(): void {
    if(localStorage.getItem('shop')!=null){
      this.getTotalPrice()
    }
  }

  getTotalPrice(){
    this.totlaPrice=0
    this.shop = JSON.parse(localStorage.getItem('shop') || "")
      console.log(this.shop);
      for(let i=0; i<this.shop.length; i++){
        this.totlaPrice+=  this.shop[i].price*this.shop[i].amount
      }
  }

  truncateNum(amount:number){
    return Math.round(amount*100)/100
  }

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

  changeNumber(index:number, event: Event){
    this.maxStok =0;
    const input: HTMLInputElement = <HTMLInputElement>event.target
    this.shop[index].amount = Number(input.value)
    localStorage.setItem('shop', JSON.stringify(this.shop))
    this.getTotalPrice()
    
  }

  buy(){
    this.shop.forEach((gameBill) => {
      const {idVideogame, nameVideogame, amount,...rest} = gameBill
      this.shopBuy.push({idVideogame, nameVideogame, amount})
    })
    this.authService.renew()
    this.username = this.authService.usernameSignal
    if(this.username() != ""){
      this.billService.buy(this.shopBuy, this.username()).subscribe({
        next : (bill) =>{
          Swal.fire({
            title: "Save!",
            text: "Your file has been added in your basket.",
            icon: "success",
            confirmButtonColor:"#43844B" 
          }).then((resultado)=>{
            localStorage.removeItem("shop")
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
    }
    
    
  }

}
