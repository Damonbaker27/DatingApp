import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { Environment } from '../enviorments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = Environment.apiUrl;

  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;

  constructor(private http :HttpClient) {}

  getMembers(pageNumber?: number, pageSize?: number){
    let queryParams = new HttpParams();

    if(pageNumber && pageSize){
      queryParams = queryParams.append('pageNumber', pageNumber);
      queryParams = queryParams.append('pageSize', pageSize);
    }

    //return an observable of this members array
    if(this.members.length > 0){
      return of(this.members)
    }

    console.log(this.baseUrl + 'users', queryParams);
    //add the returned data to the members array
    return this.http.get<Member[]>(this.baseUrl + 'users', { params: queryParams } ).pipe(
      // map(members => {
      //   this.members = members;
      //   return members;
      //})
    )
  }

  getMember(username: string){
    const member = this.members.find(x => x.userName == username);
    if(member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() =>{
        //get index of member to be updated in array
        const index = this.members.indexOf(member);
        // update the cached members array during update.
        this.members[index] = {...this.members[index],...member}
      })
    )
  }

  setMainPhoto(photoId :number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }


  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }



}
