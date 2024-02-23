import { Component, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { Bill, ListGameBill, ListPageableBill } from '../../interfaces/bill';
import { ListPageable } from '../../interfaces/videogames';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-bill.component.html',
  styleUrl: './list-bill.component.css'
})
export class ListBillComponent implements OnInit{

  constructor(private billService: BillService, private authService: AuthService) {}

  listBill: Bill[] = []
  pageable!: ListPageableBill
  username : any;
  listBillGames: ListGameBill[] = []
  sort: boolean = true;
  order: string = "";
  numberSequence : number[] =[]

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

  nextPage(attribute: string, numPage: number){
    this.authService.renew()
    this.username = this.authService.usernameSignal
    if(attribute != ""){
      this.order=attribute;
    }else{
      this.order="idBill"
    }
    this.numberSequence = []
    this.billService.getBillOrder(this.order, this.username(), numPage, this.sort).subscribe({
      next: (page)=>{
        this.pageable = page;
        this.listBill = page.content;
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
      }
    })
  }
  sortPage(attribute: string, numPage: number){
    this.authService.renew()
    this.username = this.authService.usernameSignal
    if(this.sort){
      this.sort = false
    }else{
      this.sort = true
    }
    this.order=attribute;
    this.billService.getBillOrder(attribute, this.username(), numPage, this.sort).subscribe({
      next: (page)=>{
        this.pageable = page;
        this.listBill = page.content;
      }
    })
  }

  getGames(num: number){
    if(this.listBill[num]!=null){
      this.listBillGames = this.listBill[num].listGameBill
    }
  }


}
