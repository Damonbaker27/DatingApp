import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { userParams } from 'src/app/_models/userParams';
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
  pageNumber = 1;
  pageSize = 4;
  userParams: userParams = new userParams();


  constructor(private memberService : MembersService) {
    this.userParams.pageNumber = this.pageNumber;
    this.userParams.pageSize = this.pageSize;
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
    this.pageNumber = event.page;
    this.loadMember();
  }


}
