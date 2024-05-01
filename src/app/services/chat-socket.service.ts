import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../interfaces/chat-message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  private stompClient: any;
  private baseUrl : string= "//localhost:8080/chat-socket";
  private messageSubject : BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([])

  constructor() {
    this.innitConnectionSocket()
   }

  innitConnectionSocket(){
    const socket = new SockJS(this.baseUrl)
    this.stompClient = Stomp.over(socket)
  }

  joinRoom(roomId: string){
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/${roomId}`, (message: any)=>{
        const messageContent = JSON.parse(message.body);
        const currentMessage = this.messageSubject.getValue()
        currentMessage.push(messageContent)
        this.messageSubject.next(currentMessage)
      })
    })
  }


  sendMessage(roomId: string, chatMessage: ChatMessage){
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
  }

  getMessageSubject(){
    return this.messageSubject.asObservable()
  }

}
