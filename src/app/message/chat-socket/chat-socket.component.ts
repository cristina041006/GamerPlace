import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatSocketService } from '../../services/chat-socket.service';
import { ChatMessage } from '../../interfaces/chat-message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { Message, MessageSend } from '../../interfaces/message';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-socket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-socket.component.html',
  styleUrl: './chat-socket.component.css'
})
export class ChatSocketComponent implements OnInit{

  @ViewChild('listaContainer') listaContainer!: ElementRef;

  messageInput: string = "";
  userId!: any;
  messageList: any[] = []
  messageData: Message[] = []
  today!: Date;
  rol: any;
  constructor(private chatMessageService: ChatSocketService,
    private messageService: MessageService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.chatMessageService.joinRoom("ABC")
    this.authService.renew()
    this.userId = this.authService.usernameSignal
    this.rol = this.authService.rolSignal

    this.listenerMessage()
    this.messageService.getMessages().subscribe({
      next: (messages) => {
        this.messageData = messages
      }
    })
    this.messageData.reverse()
  }

  getDate(){
    this.today = new Date();
  }

  sendMessage(){
    if(this.rol()!='admin' && this.rol()!="" && this.userId()!=''){
      this.getDate()
      console.log(this.today);
      
      let message: MessageSend = {
        user: this.userId(),
        content : this.messageInput,
        date: this.today
      }
      console.log(message);
      this.chatMessageService.sendMessage("ABC", message)
      this.messageInput = '';
    }else if(this.rol()=='admin'){
      Swal.fire({
        title: "Error",
        text: "Admin cant send a message",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor:"#949494" 
      });   
    }else if(this.userId()==''){
      Swal.fire({
        title: "Error",
        text: "Login to send a message",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor:"#949494" 
      });   
    }
    
  }

  listenerMessage(){
    this.chatMessageService.getMessageSubject().subscribe((message: any) =>{
      this.messageList = message.map((item: any) =>({
        ...item,
        message_side: item.user ==this.userId()? 'sender' : 'receiver'
      }))
    })
  }

}
