import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Environment } from 'src/app/enviorments/environment';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

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

constructor(private accountService: AccountService) {
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
    // not using jwt interceptor so token is needed here.
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
    }
  }


}


}
