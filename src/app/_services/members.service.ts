import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { find, map, of } from 'rxjs';
import { Environment } from '../enviorments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { userParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = Environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;
  user: User | undefined;
  userParams: userParams | undefined;
  //newPaginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;

  constructor(private http :HttpClient, private accountService: AccountService) {
    accountService.getCurrentUser().subscribe({
      next: user => {
        if(user){
          this.userParams = new userParams(user);
          this.user = user;
        }
      }
    })
  }


  getUserParams(){
    return this.userParams;
  }

  setUserParams(userParams: userParams){
    this.userParams = userParams;
  }

  resetParams(){
    if(this.user){
      this.userParams = new userParams(this.user);
    }
  }

  getMembers(userParams: userParams){
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if(response){
      return of(response);
    }

    let queryParams = new HttpParams();

    //add pagination information to params
    queryParams = this.getParams(userParams, queryParams);

    return this.getPaginationHeaders(queryParams).pipe(
      map(paginatedResult =>{

        let newPaginatedResult = new PaginatedResult<Member[]>;
        newPaginatedResult.pagination =paginatedResult.pagination;
        newPaginatedResult.result = paginatedResult.result;

        this.memberCache.set(Object.values(userParams).join('-'),  newPaginatedResult);
        return paginatedResult;

      })

    );
  }


  addLike(username: string){
    return this.http.post(this.baseUrl + 'likes/' + username, {}, {responseType:'text'});
  }

  getLikes(predicate: string){
    return this.http.get(this.baseUrl + 'likes?predicate=' + predicate, {responseType:'text'})
  }

  getMember(username: string){
    //flatten the 2 arrays into one for searching.
    const member = [...this.memberCache.values()]
    .reduce((arr, element) => arr.concat(element.result), []).
    find((member:Member)=> member.userName == username);

    if(member){
      return of(member);
    }

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

  private getPaginationHeaders(queryParams: HttpParams) {
    return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params: queryParams }).pipe(
      map(response => {
        //set result to response body containing members.
        if (response.body) {
          this.paginatedResult.result = response.body;
        }
        //retrive the pagination header
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          //turn the json header into an object
          this.paginatedResult.pagination = JSON.parse(pagination);
        }
        return this.paginatedResult;
      })
    );
  }

  private getParams(userParams: userParams, queryParams: HttpParams) {
    if (userParams.pageNumber && userParams.pageSize) {
      queryParams = queryParams.append('pageNumber', userParams.pageNumber);
      queryParams = queryParams.append('pageSize', userParams.pageSize);
      queryParams = queryParams.append('minAge', userParams.minAge);
      queryParams = queryParams.append('maxAge', userParams.maxAge);
      queryParams = queryParams.append('gender', userParams.gender);
      queryParams = queryParams.append('orderBy', userParams.orderBy);
    }
    return queryParams;
  }


}
