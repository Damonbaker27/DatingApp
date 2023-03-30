import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Environment } from '../enviorments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = Environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: User){
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
      map((response: User)=>{
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      } )
    );
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  deleteAccount(){

  }



  setCurrentUser(user :User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    this.currentUserSource.next(null);
    localStorage.removeItem('user');
  }


}
