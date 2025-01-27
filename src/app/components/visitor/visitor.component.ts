import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-services/auth.services';
import { VisitorService } from '../../services/visitor-services/visitor.services';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Visitor } from '../../models/visitor.model';
import { ResponseEntity } from '../../models/response.model';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../models/user.model';
import { Roles } from '../signup/signup.component';
import { UserService } from '../../services/user-services/user.services';

@Component({
  selector: 'app-visitor',
  standalone:true,
  imports: [NgIf,NgFor,ReactiveFormsModule],
  templateUrl: './visitor.component.html',
  styleUrl: './visitor.component.css'
})
export class VisitorComponent {
   private destroyRef=inject(DestroyRef);
   role : Roles|null | undefined =null;
constructor(private authService: AuthService, private userService: UserService ,private visitorService: VisitorService){}
user: User | null = null;
ngOnInit() {
  this.user = this.authService.user$();
  this.role = this.authService.role$();
  console.log(this.role);
}
 //variables
  
  listOfVisitors :Visitor[] =[];
  listOfPendingRequests :Visitor[] =[];
  listOfVisitorsByUser :Visitor[] =[];
 
  selectedVisitorId=signal<string | null>(null);
  // selectedVisitor=signal<Visitor | null>(null);
 

  //Adding New Visitor 
  addVisitorFormVisibility: boolean =false;
  selectedUsername: string | null = null;
  listOfUsernames: User[] = [];
  onClickingAddVisitor(){ 
    this.addVisitorFormVisibility=!this.addVisitorFormVisibility;
    if (this.role?.toString() === "guard" && this.addVisitorFormVisibility) {
      this.fetchUser();
      // console.log(" oncl"+this.listOfUsernames)
    }
  }

  fetchUser() {
    const sub = this.userService.getUserNames().subscribe({
      next: (response: ResponseEntity) => {
        if (response.status.toString() === 'SUCCESS') {
          this.listOfUsernames = response.data as User[];
          // console.log(this.listOfUsernames)
        }
      },
    });
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  form = new FormGroup({
    name: new FormControl( '',[Validators.required,  Validators.minLength(3)]
  ),
  purpose: new FormControl( '',[Validators.required]
  ),
  arrivalTime: new FormControl( '',[Validators.required]
  ),
  departureTime: new FormControl( '',{}
  ),
  arrivalDate: new FormControl( '',[Validators.required]
    ),
    dep_date: new FormControl( '',{}
    ),
    contactNo: new FormControl( '',[Validators.required, Validators.pattern('^[0-9]{10}$')]
  ),
  selectedUsername: new FormControl('', [Validators.required]) 
  
});
  OnSubmitAddVisitor(){
    let userID: string;
    if (this.role === Roles.RESIDENT) {
      userID = this.user!.idUser;
    } else if (this.role === Roles.GUARD) {
      const selectedUser = this.listOfUsernames.find(
        (user) => user.userName === this.selectedUsername
      );
      if (!selectedUser) {
        alert('Please select a valid username.');
        return;
      }
      userID = selectedUser.idUser;
    }

    const visitor : Visitor={
      idVisitor:'null',
      userId: userID!,
      name: this.form.value.name!,
      purpose :this.form.value.purpose!,
      arrivalTime :this.form.value.arrivalTime!,
       departureTime: this.form.value.departureTime!,
        dep_date :this.form.value.dep_date!,
       contactNo :this.form.value.contactNo!,
      arrivalDate:this.form.value.arrivalDate!,
      status:'null'
    } 
    if(this.form.valid){
      const sub = this.visitorService.createVisitor(this.user!.idUser, visitor).subscribe({
        next : (response:ResponseEntity)=>
        {
          if(response.status.toString()==="SUCCESS")
          {
            alert("Visitor Added Successfully");
            this.addVisitorFormVisibility=false;
          }
        },
      });
      this.destroyRef.onDestroy(()=>{
        sub.unsubscribe();
      });
    }
  }




//View All Visitor By Admin
showTableByAdmin: boolean=false;
onViewAllVisitorByAdmin(){
  this.showTableByAdmin = !this.showTableByAdmin; 
    this.ViewAllVisitorByAdmin()
    this.fetchUser();
  
  }
  ViewAllVisitorByAdmin(){
    const sub = this.visitorService.getAllVisitors().subscribe({
      next: (response: ResponseEntity) =>{
        if(response.status.toString()==="SUCCESS")
        {
          this.listOfVisitors= response.data as Visitor[];
        }    
      },
    });
    this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
  }
  // get USerName
  getUserName(userId: string): string {
    const user = this.listOfUsernames.find(u => u.idUser === userId);
    return user ? user.userName : 'Unknown';  
  }
 
//View All Vistor By User
showTableByUsern: boolean=false;

onClickingViewVisitorByUser(){ 

  this.showTableByUsern = !this.showTableByUsern ;
  if(this.showTableByUsern)
  this.onViewAllVisitorByUser(); 
 }

  onViewAllVisitorByUser(){
  
    const sub = this.visitorService.getVisitorsByUser(this.user!.idUser) . subscribe({
      next: (response: ResponseEntity) =>{
        if(response.status.toString()==="SUCCESS")
          {
          this.listOfVisitorsByUser= response.data as Visitor[];
        }     
      },
    });
     this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
  }

//Managing Request By visitor
  //1. Showing Pending requests data
  
  ViewPendingRequestsTable:boolean =false;  // showPendingRequests:boolean=false;
  onClickingManageRequests(){
     this.ViewPendingRequestsTable = !this.ViewPendingRequestsTable; 
     if(this.ViewPendingRequestsTable) 
      this.FetchPendingRequestTableData() }
  FetchPendingRequestTableData(){
  const sub = this.visitorService.getVisitorByStatus(this.user!.idUser , "Pending").subscribe({
    
    next: (response:ResponseEntity) => {
      if(response.status.toString()==="SUCCESS"){
        this.listOfPendingRequests= response.data as Visitor[];
        console.log(this.listOfPendingRequests + this.user!.idUser)
      }
    }
  });
  this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
}
  //2.  Select Visitor to approve or deny and show approve or deny button
  showChangestatusButton=false;
  onSelectingVisitor(visitor :Visitor){
  this.showChangestatusButton=true;
  this.selectedVisitorId.set(visitor.idVisitor);
}
  // 3. Changing Status of Visitor 
  onClickingChangeStatusButton(status:string){
    const sub = this.visitorService.updateVisitorStatus(this.selectedVisitorId.toString(), status  ).subscribe({
      next: (response: ResponseEntity) =>{
        if(response.status.toString()==="SUCCESS")
          {
            alert("Status Change successfully");
            this.showChangestatusButton = false;
            this.selectedVisitorId.set(null);
            this.ViewPendingRequestsTable=false;
          }
      },
    });
    this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
  }
}
