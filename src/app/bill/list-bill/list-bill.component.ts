import { Component, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { Bill, ListGameBill, ListPageableBill } from '../../interfaces/bill';
import { ListPageable } from '../../interfaces/videogames';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-bill.component.html',
  styleUrl: './list-bill.component.css'
})
export class ListBillComponent implements OnInit{
/**Componente para listar las facturas de un usuario y los juegos de dicha factura */

/**Contructor donde llamaremos los servicios de bill y auth */
  constructor(private billService: BillService, private authService: AuthService) {}

//Variables
  listBill: Bill[] = [] //Lista de facturas
  pageable!: ListPageableBill //Pageable
  username : any; // usuario logueado
  listBillGames: ListGameBill[] = [] //lista de jeugos de facturas
  sort: boolean = true; //orden
  order: string = ""; //atrubito por el cual se ordena
  numberSequence : number[] =[] //secuencia del numero para el pageable

  /**
   * Metodo que se ejecurata cuando se cargue el componenete, mirara que usuario esta logueado y hara una peticion
   * para traerse las facturas de ese usuario ademas de calcular la secuencia de nuemros para el pageable
   */
  ngOnInit(): void {
    this.authService.renew()
    this.username = this.authService.usernameSignal
    this.billService.getBill(this.username()).subscribe({
      next: (page) => {
        this.pageable = page;
        this.listBill = page.content;
        for(let i=1; i<page.pageable.pageNumber+6; i++){
          this.numberSequence.push(i);
        }
      }
    })
  }
  
  /**
   * Metodo para poder pasar de pagina respentando la ordenacion que ya tenia y 
   * el campo por el cual ya estaba ordenado
   * @param attribute 
   * @param numPage 
   */
  nextPage(attribute: string, numPage: number){
    //Buscamos el usuario logueado
    this.authService.renew()
    this.username = this.authService.usernameSignal
    //Miramos si estamos ordenando por algun atributo
    if(attribute != ""){
      this.order=attribute;
    }else{
      this.order="idBill"
    }
    //Vaicamos la secuencia de nuemros y hacemos la peticion para que nos devuelva la pagina siguiente
    this.numberSequence = []
    this.billService.getBillOrder(this.order, this.username(), numPage, this.sort).subscribe({
      next: (page)=>{
        this.pageable = page;
        this.listBill = page.content;
        //Calculamos de nuevo la secuencia de numeros controlando si estamos en la primera, ultima o una pagina del medio
        if(page.pageable.pageNumber==0){
          for(let i=1; i<page.pageable.pageNumber+6; i++){
            this.numberSequence.push(i);
          }
        }else if(numPage+5<=page.totalPages){
          for(let i=page.pageable.pageNumber; i<page.pageable.pageNumber+5; i++){
            this.numberSequence.push(i);
          }
        }else{
          for(let i=page.pageable.pageNumber; i<page.totalPages+1; i++){
            this.numberSequence.push(i);
          }
        }
      },
      error: (error)=>{
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

/**
 * Metodo para ordenar ascendente o descendentemente la lista, respentando el atributo por el cual estaba ordenado y el nuermo de paginas
 * en las que estaba
 * @param attribute 
 * @param numPage 
 */
  sortPage(attribute: string, numPage: number){
    //Miramos el uausuario logueado
    this.authService.renew()
    this.username = this.authService.usernameSignal

    //Cambiamos el sentido del orden
    if(this.sort){
      this.sort = false
    }else{
      this.sort = true
    }
    //Hacemos peticion para que nos devuelva los datos correctos
    this.order=attribute;
    this.billService.getBillOrder(attribute, this.username(), numPage, this.sort).subscribe({
      next: (page)=>{
        this.pageable = page;
        this.listBill = page.content;
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

  /**
   * Metodo para obtener los juegos de una factura en especifico
   * @param num 
   */
  getGames(num: number){
    if(this.listBill[num]!=null){
      this.listBillGames = this.listBill[num].listGameBill
    }
  }


}
