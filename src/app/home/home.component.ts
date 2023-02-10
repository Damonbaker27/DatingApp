import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  users: any;

  constructor(private http : HttpClient){}
  ngOnInit(): void {
    this.getUsers();
  }


  getUsers(){
    this.http.get<any>('https://localhost:7296/api/Users/').subscribe(response =>{
      this.users = response;
      console.log(response);
    })
  }

  CancelRegisterMode(event: boolean){
    this.registerMode = event;
  }

  RegisterToggle(){
    this.registerMode = !this.registerMode;
  }
}
