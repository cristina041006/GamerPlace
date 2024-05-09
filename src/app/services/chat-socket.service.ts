import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../interfaces/chat-message';
import { BehaviorSubject } from 'rxjs';
import { MessageSend } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
/**Servicio para la logica del chat socket service */

  private stompClient: any;
  //url donde vamos a enviar los datos (por tcp no por http)
  private baseUrl : string= "//localhost:8080/chat-socket";
  //Subjet para poder guardar los mensajes que se envian en cache
  private messageSubject : BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([])

  //Inicializamos la conexion al socket
  constructor() {
    this.innitConnectionSocket()
   }

  /**
   * Metodo para inicializar el socket con SockJS libreria de socket io para angular
   */
  innitConnectionSocket(){
    const socket = new SockJS(this.baseUrl)
    this.stompClient = Stomp.over(socket)
  }

  /**
   * Metodo para unirse a una sala y conectar el stompClient
   * @param roomId 
   */
  joinRoom(roomId: string){
    this.stompClient.connect({}, ()=>{
      //Nos suscribimos a una sala con la ruta especifica en el back
      this.stompClient.subscribe(`/topic/${roomId}`, (message: any)=>{
        console.log(JSON.parse(message.body));
        //Almacenamos el mensaje que nosostros hemos enviado al back y que el nos devuelve
        //en el subjet 
        const messageContent = JSON.parse(message.body);
        const currentMessage = this.messageSubject.getValue()
        currentMessage.push(messageContent)
        this.messageSubject.next(currentMessage)
      })
    })
  }


  /**
   * Metodo para enviar un mensaje al back a partir de la ruta especificada y almacenarlo en la base
   * de datos, especificando la room a la que va ese mensaje
   * @param roomId 
   * @param chatMessage 
   */
  sendMessage(roomId: string, chatMessage: MessageSend){
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
  }

  /**
   * Metodo para obtener el subjet es decir la lisra de mensajes 
   * @returns 
   */
  getMessageSubject(){
    return this.messageSubject.asObservable()
  }

}
