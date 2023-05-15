import { Component } from '@angular/core';
import { subscribeOn } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent {

  members: Member[] | undefined;
  predicate = 'liked';



  constructor(private memberService: MembersService){
    this.loadLikes();
  }

  loadLikes(){
    this.memberService.getLikes(this.predicate).subscribe({
      next: response =>{
        this.members = response;
      }
    })
  }
}
