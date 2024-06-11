import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, MessageEdit } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
/**Servicio para controlar la logica de los mensajes que van a base de datos */

  private baseUrl : string= "https://proyectoapi-cristina041006.onrender.com";
  constructor(private http : HttpClient) { }

  /**
   * Metodo para obtener los mensajes de la base de datos
   * @returns una lista de mensajes
   */
  getMessages(): Observable<Message[]>{
    return this.http.get<Message[]>(`${this.baseUrl}/getMessages`);
  }

  editService(idMessage: number, message: MessageEdit):Observable<Message>{
    return this.http.put<Message>(`${this.baseUrl}/editMessage/${idMessage}`, message)
  }
  

  deleteService(idMessage: number): Observable<Message>{
    return this.http.delete<Message>(`${this.baseUrl}/deleteMessage/${idMessage}`)
  }

}
