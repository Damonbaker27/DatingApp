import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
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
  pageSize = 2;

  constructor(private memberService : MembersService) {}

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: response =>{
        if(response.result && response.pagination){
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

}
