import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-floating-circle',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './floating-circle.component.html',
  styleUrls: ['./floating-circle.component.css']
})
export class FloatingCircleComponent implements OnInit {

  constructor() { }

  topPosition: number = 0;
  show: boolean = false;
  

  
  ngOnInit(): void {
    
  }

  showMethod(){
    if(localStorage.getItem("Tipografia")){
      if(localStorage.getItem("Tipografia")=="Dislexico"){
        this.show = true;
      }else{
        this.show = false;
      }
    }else{
      this.show = false
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.topPosition = event.clientY;
  }

  changueTypografy(){
    Swal.fire({
      title: "Activate dyslexic mode?",
      text: "It will help you read!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43844B",
      cancelButtonColor: "#949494",
      confirmButtonText: "Yes, change it!"
    }).then(response=>{
      if(response.isConfirmed){
        if(localStorage.getItem("Tipografia")){
          if(localStorage.getItem("Tipografia") == "Normal"){
            localStorage.setItem("Tipografia", "Dislexico")
            this.showMethod()
          }else{
            localStorage.setItem("Tipografia", "Normal")
            this.showMethod()
          }
        }else{
          localStorage.setItem("Tipografia", "Dislexico")
          this.showMethod()
          
        }
      }
    })
  }

}
