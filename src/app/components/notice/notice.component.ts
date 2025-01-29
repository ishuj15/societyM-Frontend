import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../services/auth-services/auth.services';
import { NoticeService } from '../../services/notice-services/notice.services';
import { Roles } from '../signup/signup.component';
import { NgFor, NgIf } from '@angular/common';
import { DatabaseNotice, TargetRole } from '../../models/notice.model';
import { ResponseEntity } from '../../models/response.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { tick } from '@angular/core/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notice',
  standalone:true,
  imports: [ReactiveFormsModule, NgFor , NgIf],
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.css'
})
export class NoticeComponent {
  constructor(private authService : AuthService , private noticeService : NoticeService, private router: Router){  }
  private destroyRef=inject(DestroyRef);
  role : Roles|null  =null;
  notices :DatabaseNotice[] =[];

  ngOnInit() {
    this.role = this.authService.role$()!;
 
  }

  //1. Adding Notice By admin only
  isAddNoticeVisible: boolean=false;
  onClickingAddNotice(){  
     this.isAddNoticeVisible=!this.isAddNoticeVisible;
    if(this.isAddNoticeVisible){
      this.ShowTableToUser = false;
      this.showTableAdmin =false;
      this.deleteButton  =false; 
      this.updateButton =false;  
      this.updateOption =false; 
      this.deleteOption=false;
    }
    
    
    }
  form  = new FormGroup({
    title : new FormControl('',{}),
    message : new FormControl('',{}),
    targetRole :new FormControl<TargetRole| null>(null,{}),
     date :new FormControl('',{}),
  });
  onSubmitNewNotice(){

    if(this.form.valid){
      const notice: DatabaseNotice= 
      {
        idNotices:' null',
        title: this.form.value.title!,
        message : this.form.value.message!,
        date : this.form.value.date!,
        targetRole: this.form.value.targetRole!

      };
      this.isAddNoticeVisible=true;
    const sub= this.noticeService.createNotice(notice).subscribe( {
      next: (response: ResponseEntity) =>{

          if(response.status.toString()==="SUCCESS")
          {
            alert("Notice Created Successfully");
          this.isAddNoticeVisible=false;
          this.ShowTableToUser = false;
          this.showTableAdmin =false;
          this.deleteButton  =false; 
          this.updateButton =false;  
          this.updateOption =false; 
          this.deleteOption=false;
          this.isAddNoticeVisible=false;
            // this.router.navigate(['/home/notice']);
          }
      },
    });
    this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
  }
  }

  //2. ViewingNotice by resident or guard
  
  
  ShowTableToUser : boolean= false;
  onClickingViewNoticeUser(){   
   this.ShowTableToUser=!this.ShowTableToUser;
    if(this.ShowTableToUser)
      this.onFetchingNoticesUser();
     }
  onFetchingNoticesUser(){
    const sub = this.noticeService.getNoticeByRole(this.role!).subscribe({
      next : (response : ResponseEntity) =>
      {
      if(response.status.toString()==="SUCCESS")
      {
        this.notices= response.data as DatabaseNotice[]; 
      }
    },
    }) ; 
    this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
  }

  //  3. Viewing Notice by admin
  showTableAdmin: boolean=false;
  onClickingViewNoticeAdmin(){
    this.showTableAdmin= !this.showTableAdmin;
    if(this.showTableAdmin)
    {
      this.ShowTableToUser = false;
      this.deleteButton  =false; 
      this.updateButton =false;  
      this.updateOption =false; 
      this.deleteOption=false;
      this.isAddNoticeVisible=false;
      this.selectedNoticeForUpdate = null; 
      this.selectedNotice = null;   
      this.onFetchingNoticesAdmin();
    }
   
  }
  onFetchingNoticesAdmin(){
    const sub = this.noticeService.getAllNotice().subscribe({
      next : (response : ResponseEntity) =>
      {
      if(response.status.toString()==="SUCCESS")
      {
        this.notices= response.data as DatabaseNotice[]; 
      }
    },
    }) ;
    this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
  }
  //4. Delete Notice By admin only
  //a) Showing  table to select
  deleteOption:boolean=false;
  onClickingDeleteOption(){
    this.deleteOption=!this.deleteButton;
    if(this.deleteOption){
      this.showTableAdmin=true;
      this.ShowTableToUser = false;
      this.deleteButton  =false; 
      this.updateButton =false;  
      this.updateOption =false; 
      this.isAddNoticeVisible=false;
      this.onFetchingNoticesAdmin();
    }
    }
    
  
    
  // same view all notices so no need to write function refer fun-> ViewNotice
  //b) Selecting the notice and setting it to the selectedNotice and showing deletebutton as well
  selectedNotice: DatabaseNotice| null= null;
  deleteButton:Boolean=false;  
  onSelectingNotice( notice: DatabaseNotice){
     this.deleteButton=!this.deleteButton;
      this.selectedNotice=notice;  }
  //c) Deleting notice and also set everything back 
  onClickingDeleteButton(){
    const sub =this.noticeService.deleteNotice(this.selectedNotice!.idNotices).subscribe({
      next: (response: ResponseEntity) =>{
        if(response.status.toString()==="SUCCESS")
          {
            alert("Notice Deleted Successfully");
            this.ShowTableToUser = false;
            this.showTableAdmin =false;
            this.deleteButton  =false; 
            this.updateButton =false;  
            this.updateOption =false; 
            this.deleteOption=false;
            this.isAddNoticeVisible=false;
            this.selectedNotice=null;
          }
      }
    });
    this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
  } 

  onCancelDelete() {
    this.deleteButton = false;
    this.selectedNotice = null;
  }
  //5. Update Notice
  // a) Showing table to select for updation
  selectedNoticeForUpdate: DatabaseNotice| null= null;
  updateButton:Boolean=false;  
  updateOption:Boolean=false; 
  UpdateNoticeOption(){
    this.updateOption=!this.updateOption;
    if(this.updateOption){
      this.showTableAdmin=true;
      this.ShowTableToUser = false;
      this.deleteButton  =false; 
      this.updateButton =false;  
      this.deleteOption=false;
      this.isAddNoticeVisible=false;
      this.onFetchingNoticesAdmin();
    }
  }
  updateForm = new FormGroup({
    title: new FormControl('', {}),
    message: new FormControl('', {}),
    date: new FormControl('', {}),
  });
  onSelectingNoticeUpdate( notice: DatabaseNotice) {
     this.updateButton= !this.updateButton;
     this.selectedNoticeForUpdate=notice 
     this.showTableAdmin=false;
     this.isAddNoticeVisible=false;
     this.deleteButton=false;
 
    // Pre-fill the form with the selected notice's values
    this.updateForm.setValue({
      title: notice.title,
      message: notice.message,
      date: notice.date,
    });
  }
  //c) on clicking update show update form 


  onClicikingUpdateButton(){
    if (this.updateForm.valid && this.selectedNoticeForUpdate) {
      // Create a copy of the updated notice
      
        const updatedNotice: DatabaseNotice = {
          ...this.selectedNoticeForUpdate,
          title: this.updateForm.value.title ?? this.selectedNoticeForUpdate.title, // Default to existing value
          message: this.updateForm.value.message ?? this.selectedNoticeForUpdate.message, // Default to existing value
          date: this.updateForm.value.date ?? this.selectedNoticeForUpdate.date, // Default to existing value
        };
    
      // Call the service to update the notice
      const sub = this.noticeService.updateNotice( this.selectedNoticeForUpdate.idNotices, updatedNotice).subscribe({
        next: (response: ResponseEntity) => {
          if (response.status.toString() === 'SUCCESS') {
            alert('Notice Updated Successfully');
            this.updateButton = false;
            this.selectedNoticeForUpdate = null;
            this.updateOption=false;
            this.showTableAdmin=false;

          }
        },
      });
      this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
    }
}
onCancelUpdate() {
  this.updateButton = false;
  this.selectedNoticeForUpdate = null;
}
}

