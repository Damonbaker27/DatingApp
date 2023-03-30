import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  //access the html template variable "editForm"
  @ViewChild("editForm") editForm: NgForm | undefined;

  // get access to browser event to stop user from leaving page.
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any){
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }

  member :Member | undefined;

  user: User | null = null;

  constructor(private accountService: AccountService,
    private memberService: MembersService, private toast: ToastrService) {

      this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    if(!this.user) return;

    this.memberService.getMember(this.user.userName).subscribe({
      next: member => this.member = member
    })
  }

  updateMember(){
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toast.success("profile updated successfully.")
        //reset and then set the form to the new data.
        this.editForm?.reset(this.member);
      }
    })
  }




}
