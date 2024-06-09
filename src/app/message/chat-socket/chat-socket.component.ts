import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
export class ChatSocketComponent implements OnInit, AfterViewInit, OnChanges{
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
      }
    })
    this.scrollToBottom()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.scrollToBottom2()
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
    setTimeout(() => {
      const ul = document.getElementById("list") as HTMLObjectElement
      ul.scroll(0,ul.scrollHeight)
    }, 1000); // Delay de 2000 milisegundos (2 segundos)
    
  }
  scrollToBottom2() {
    setTimeout(() => {
      const ul = document.getElementById("list") as HTMLObjectElement
      ul.scroll(0,ul.scrollHeight)
    }, 2); // Delay de 2000 milisegundos (2 segundos)
    
  }
  
  /**
   * Metodo para enviar un mensaje y guardarlo en la base de datos
   */
  sendMessage(){
    //Comprobamos que esta logueado y que no es un admin
    if(this.rol()!='admin' && this.rol()!="" && this.userId()!=''){
      this.getDate()
      
      //Rellenamos el mensaje que se va a mandar
      let message: MessageSend = {
        user: this.userId(),
        content : this.messageInput,
        date: this.today
      }

      //Enviamos el mensaje a backend y limpiamos el mensaje
      this.chatMessageService.sendMessage("ABC", message)
      this.messageInput = '';
      this.scrollToBottom2()

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
      this.scrollToBottom2()

    })
  }

}
