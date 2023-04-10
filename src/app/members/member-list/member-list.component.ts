import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { userParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  //members$: PaginatedResult<Member> | Observable<PaginatedResult<Member[]>>;
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: userParams | undefined;
  user: User | null = null;


  constructor(private memberService : MembersService, private accountService: AccountService ) {
    this.accountService.getCurrentUser().subscribe({
      next: user => {
        this.user = user;
        if(this.user){
          this.userParams = new userParams(this.user);
        }
      }
    })
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    if(this.userParams != null){
    this.memberService.getMembers(this.userParams).subscribe({
      next: response =>{
        if(response.result && response.pagination){
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })}
  }

  pageChanged(event: any){
    if(this.userParams){
      this.userParams.pageNumber = event.page;
    }
    this.loadMember();
  }


}
