import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  model: any = {};

  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();

  register(){
    console.log(this.model);
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
