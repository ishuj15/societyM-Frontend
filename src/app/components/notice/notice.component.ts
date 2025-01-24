import { Component, signal } from '@angular/core';
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
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.css'
})
export class NoticeComponent {
  constructor(private authService : AuthService , private noticeService : NoticeService, private router: Router){  
  }
  
  form  = new FormGroup({
    title : new FormControl('',{}),
    message : new FormControl('',{}),
    targetRole :new FormControl<TargetRole| null>(null,{}),
     date :new FormControl('',{}),
  });
  // index$ = signal<number>(0);
  // role: Roles | null = null; // Static role
 role=Roles.ADMIN;
  admin=Roles.ADMIN;
  resident =Roles.RESIDENT;
  guard =Roles.GUARD;
  isAddNoticeVisible: boolean=false;
  toShowTable : boolean= false;
  notices :DatabaseNotice[] =[];
  // deleteNotice =signal<DatabaseNotice| null>(null);
  selectedNotice: DatabaseNotice| null= null;
  deleteButton:Boolean=false

  onClickingAddNotice(){
    if(this.isAddNoticeVisible===false)
    {
      this.isAddNoticeVisible=true;
    }
    else
    this.isAddNoticeVisible=false;
  }
  onClickingViewNotice(){
    if(this.toShowTable===false)
    {
      this.onFetchingNotices();
      this.toShowTable=true;
    }
    else
    {
      this.toShowTable=false;
    }

  }
  
  onSelectingNotice( notice: DatabaseNotice){
    this.deleteButton=true;
    this.selectedNotice=notice;
  }



  ngOnInit(){
    // this.role=this.authService.role$();
    // console.log(this.role);
  }
  onFetchingNotices(){
    const sub = this.noticeService.getAllNotice().subscribe({
      next : (response : ResponseEntity) =>
      {

      if(response.status.toString()==="SUCCESS")
      {
        this.notices= response.data as DatabaseNotice[];
        // console.log(this.notices);
        // console.log(response.data )
      }
    },

    }) ;
  }

  onClickingDeleteButton(){
  
    const sub =this.noticeService.deleteNotice(this.selectedNotice!.idNotices).subscribe({
      next: (response: ResponseEntity) =>{
        if(response.status.toString()==="SUCCESS")
          {
            alert("Notice Deleted Successfully");
            this.toShowTable=false;
            this.deleteButton=false;
            // this.router.navigate(['/home/notice']);

          }

      }
    });
  }


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
            // this.router.navigate(['/home/notice']);
          }
      },

      // next: () =>{

      // },
      error :()=>{

      }
    })
  }

  }

}
