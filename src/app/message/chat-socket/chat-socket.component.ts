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
import { format } from 'date-fns';

@Component({
  selector: 'app-chat-socket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-socket.component.html',
  styleUrl: './chat-socket.component.css'
})
export class ChatSocketComponent implements OnInit, AfterViewInit{
/**Componente donde se mostraran la lista de mensajes y abra un chat disponible */
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  //Variables
  messageInput: string = ""; //Donde se va a almacenar el mensaje que se va a enviar
  userId!: any; //id del usuario
  messageList: any[] = [] //donde se almacenaran los mensajes que se van a enviar
  messageData: Message[] = [] //donde se almacenaran los mensajes de base de datos
  today!: Date; 
  rol: any; 
  userScrolledUp = false;

  //constructor
  constructor(private chatMessageService: ChatSocketService,
    private messageService: MessageService,
    private authService: AuthService
  ){}

  /**
   * Metodo que se va a ejecutar cuando se cargue por primera vez el componente
   */
  ngOnInit(): void {
    //Nos unimos a una sala para activar el socket io
    this.chatMessageService.joinRoom("ABC")

    //Almacenamos el user y el rol de la persona logueada
    this.authService.renew()
    this.userId = this.authService.usernameSignal
    this.rol = this.authService.rolSignal

    //Almacenamos los mensajes que se mandan
    this.listenerMessage()

    //Recuperamos los mensajes de la base de datos
    this.messageService.getMessages().subscribe({
      next: (messages) => {
        this.messageData = messages
        this.messageData.reverse()
      }
    })
  }

  //Metodo para conseguir la fecha actual en el formato 'dd/MM/yyyy HH:mm'
  getDate(){
    const currentDate = new Date();
    return format(currentDate, 'dd/MM/yyyy HH:mm');
  }

  
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.scrollContainer.nativeElement.scrollTo({
      top: this.scrollContainer.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  }
  
  /**
   * Metodo para enviar un mensaje y guardarlo en la base de datos
   */
  sendMessage(){
    this.scrollToBottom()
    //Comprobamos que esta logueado y que no es un admin
    if(this.rol()!='admin' && this.rol()!="" && this.userId()!=''){
      this.getDate()
      console.log(this.today);
      
      //Rellenamos el mensaje que se va a mandar
      let message: MessageSend = {
        user: this.userId(),
        content : this.messageInput,
        date: this.today
      }
      console.log(message);

      //Enviamos el mensaje a backend y limpiamos el mensaje
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

  /**
   * Listener que va a guardar los mensajes en una lita para que estos no se superpongan
   * ademas de añadir un atributo para saber si el que envia el emnsaje el remitente o el
   * receptor
   */
  listenerMessage(){
    this.chatMessageService.getMessageSubject().subscribe((message: any) =>{
      this.messageList = message.map((item: any) =>({
        ...item,
        message_side: item.user ==this.userId()? 'sender' : 'receiver'
      }))
      this.messageList.reverse()
    })
  }

}
