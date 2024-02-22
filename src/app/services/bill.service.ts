import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill, GameBillBuy } from '../interfaces/bill';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private baseUrl : string= "http://localhost:8080";
  constructor(private http:HttpClient) { }

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


}
