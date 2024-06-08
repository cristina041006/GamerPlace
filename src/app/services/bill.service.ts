import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill, GameBillBuy, ListPageableBill } from '../interfaces/bill';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  /**Servicio donde vamos a controlar las facturas */

  private baseUrl : string= "https://proyectoapi-cristina041006.onrender.com";
  constructor(private http:HttpClient) { }

  /**
   * Metodo para comprar, pasandole los datos desde un fromData
   * @param listBuy 
   * @param username 
   * @returns 
   */
  buy(listBuy: GameBillBuy[], username: string): Observable<Bill>{
    const formData = new FormData()
    const blobList = new Blob([JSON.stringify(listBuy)], {
      type: 'application/json'
    })
    const blobUsername = new Blob([username], {
      type: 'application/json'
    })
    formData.append("bill", blobList);
    formData.append("user", blobUsername);
    return this.http.post<Bill>(`${this.baseUrl}/buy`, formData)
  }

  /**
   * Metodo para pdoer obtener las facturas de un usuario
   * @param username 
   * @returns 
   */
  getBill(username:string): Observable<ListPageableBill>{
    return this.http.get<ListPageableBill>(`${this.baseUrl}/getBill?user=${username}`)
  }


  /**
   * Metodo para poder tener las faturas de ese usuario paginando
   * @param numPage 
   * @param username 
   * @returns 
   */
  getBillPage(numPage: number, username:string): Observable<ListPageableBill> {
    return this.http.get<ListPageableBill>(`${this.baseUrl}/getBill?user=${username}&pageNum=${numPage}`);
  }

  /**
   * Metodo para poder tener las faturas de ese usuario paginando y ordenando
   * @param attribute 
   * @param username 
   * @param numPage 
   * @param sort 
   * @returns 
   */
  getBillOrder(attribute: string, username:string, numPage: number, sort:boolean): Observable<ListPageableBill> {
    return this.http.get<ListPageableBill>(`${this.baseUrl}/getBill?user=${username}&pageNum=${numPage}&sort=${attribute}&order=${sort}`);
  }



}
