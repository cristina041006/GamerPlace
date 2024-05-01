import { Component, Input, OnInit } from '@angular/core';
import { ChatSocketService } from '../../services/chat-socket.service';
import { ChatMessage } from '../../interfaces/chat-message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-chat-socket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-socket.component.html',
  styleUrl: './chat-socket.component.css'
})
export class ChatSocketComponent implements OnInit{

  messageInput: string = "";
  @Input() userId!: string;
  messageList: any[] = []
  constructor(private chatMessageService: ChatSocketService){}

  ngOnInit(): void {
    this.chatMessageService.joinRoom("ABC")
    this.listenerMessage()
  }

  sendMessage(){
    const chatMessage: ChatMessage = {
      message : this.messageInput,
      user: this.userId
    }
    this.chatMessageService.sendMessage("ABC", chatMessage )
    this.messageInput = '';
  }

  listenerMessage(){
    this.chatMessageService.getMessageSubject().subscribe((message: any) =>{
      this.messageList = message.map((item: any) =>({
        ...item,
        message_side: item.user ===this.userId? 'sender' : 'receiver'
      }))
    })
  }

}
