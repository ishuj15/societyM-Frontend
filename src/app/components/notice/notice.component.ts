import { Component, signal } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../services/auth-services/auth.services';
import { NoticeService } from '../../services/notice-services/notice.services';
import { Roles } from '../signup/signup.component';
import { NgIf } from '@angular/common';
import { Notice } from '../../models/notice.model';
import { ResponseEntity } from '../../models/response.model';

@Component({
  selector: 'app-notice',
  standalone:true,
  imports: [NgIf ],
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.css'
})
export class NoticeComponent {
  constructor(private authService : AuthService , private noticeService : NoticeService){
    
  }

  // index$ = signal<number>(0);
  // role: Roles | null = null; // Static role
 role=Roles.ADMIN;
  admin=Roles.ADMIN;

  ngOnInit(){
    // this.role=this.authService.role$();
    console.log(this.role);
  }
  // updateIndex(){
  //   this.index$.set(this.index$()+1);
  // }


  addNotice( formNotice: Notice){
    const sub= this.noticeService.createNotice(formNotice).subscribe( {
      next: (response: ResponseEntity) =>{

          if(response.status.toString()==="SUCCESS")
          {
            
          }
      },

      // next: () =>{

      // },
      error :()=>{

      }
    })
  }

}
