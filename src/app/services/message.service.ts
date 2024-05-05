import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }

  getMessages(): Observable<Message[]>{
    return this.http.get<Message[]>(`${this.baseUrl}/getMessages`);
  }

}
