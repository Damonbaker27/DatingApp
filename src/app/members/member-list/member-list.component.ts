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

  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: userParams | undefined;
  user: User | null = null;
  genderList = [{value: 'Male', display: 'Males'},{value: 'Female', display: 'Females'}]

  pageSizeList = [{value: '5'},{value: '10'},{value: '30'}]
  orderByList = [{value: 'lastActive', display: 'Last Active'},{value: 'new', display: 'New'}]

  constructor(private memberService : MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMember();
  }

  resetFilters(){
    this.memberService.resetParams()
    this.userParams = this.memberService.getUserParams();
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
