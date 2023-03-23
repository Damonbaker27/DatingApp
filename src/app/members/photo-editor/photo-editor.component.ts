import { Component, Input, OnInit, resolveForwardRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Environment } from 'src/app/enviorments/environment';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;

  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = Environment.apiUrl;
  user: User | undefined;

constructor(private accountService: AccountService, private memberService: MembersService) {
  this.accountService.currentUser$.pipe(take(1)).subscribe({
    next: user => {
      if(user){
        this.user = user
      }
    }
  })
}
  ngOnInit(): void {
    this.initilizeUploader();
  }

fileOverBase(event: any){
  this.hasBaseDropZoneOver = event;
}

initilizeUploader(){
  // configure uploader settings
  this.uploader = new FileUploader({
    url: this.baseUrl + "users/add-photo",

    // not using jwt interceptor so token is added here.
    authToken: 'Bearer '+ this.user?.token,
    isHTML5: true,
    allowedFileType: ['image'],
    removeAfterUpload: true,
    autoUpload: false,
    maxFileSize: 10 * 1024 * 1024

  });

  // so CORS configuration doesnt need to be changed.
  this.uploader.onAfterAddingFile = (file) => {
    file.withCredentials = false;
  }

  this.uploader.onSuccessItem = (item, response, status, headers)=>{
    if(response){
      const photo = JSON.parse(response);
      //add returned photo to member photo array
      this.member?.photos.push(photo);
      //update user photo to the new one if its the first.
      if(photo.isMain && this.user && this.member){
        this.user.photoUrl = photo.url;
        this.member.photoUrl= photo.url;
      }
    }
  }
}

setMain(photo :Photo){
  this.memberService.setMainPhoto(photo.id).subscribe({
    next: response => {
      if(this.user && this.member){
        this.user.photoUrl = photo.url;
        //set current user so that nav bar will update its photo.
        this.accountService.setCurrentUser(this.user);
        this.member.photoUrl= photo.url;
        this.member.photos.forEach(p => {
          //set current main to false
          if(p.isMain) p.isMain = false
          //set new photo to main
          if(p.id === photo.id) p.isMain = true;

        })
      }
    },
    error: error => console.log(error)
  })
}

deletePhoto(photo: Photo){
  this.memberService.deletePhoto(photo.id).subscribe({
    next: ()=>{
      if(this.member){
        //filters out the deleted photo
        this.member.photos = this.member.photos.filter(x=> x.id != photo.id)
      }
    }

  })
}



}
