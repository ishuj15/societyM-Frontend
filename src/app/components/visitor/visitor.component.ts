import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-services/auth.services';
import { VisitorService } from '../../services/visitor-services/visitor.services';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Visitor } from '../../models/visitor.model';
import { ResponseEntity } from '../../models/response.model';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../models/user.model';
import { Roles } from '../signup/signup.component';
import { UserService } from '../../services/user-services/user.services';

import { QRCode } from 'qrcode';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-visitor',
  standalone:true,
  imports: [NgIf,NgFor,ReactiveFormsModule ,NgxScannerQrcodeModule],
  templateUrl: './visitor.component.html',
  styleUrl: './visitor.component.css'
})
export class VisitorComponent {
 
   private destroyRef=inject(DestroyRef);
   role : Roles|null | undefined =null;
   user: User | null = null;
constructor(private authService: AuthService, private userService: UserService ,private visitorService: VisitorService){}
ngOnInit() {
  this.user = this.authService.user$();
  this.role = this.authService.role$();
}
 //variables
  // used for both delete and update 
  selectedVisitorId=signal<string | null>(null);

  //Adding New Visitor 
  qrCodeImage: string | null = null;
  addVisitorFormVisibility: boolean =false;
  selectedUsername: string | null = null;
  listOfUsernames: User[] = [];
  onClickingAddVisitor(){ 
    this.addVisitorFormVisibility=!this.addVisitorFormVisibility;
    // this.showTableByAdmin = false;
    this.showTableByUsern = false;
    this.ViewPendingRequestsTable=false;
    
    if (this.role?.toString() === "guard" && this.addVisitorFormVisibility) {
      this.fetchUser();
    }
  }

  fetchUser() {
    const sub = this.userService.getUserNames().subscribe({
      next: (response: ResponseEntity) => {
        if (response.status.toString() === 'SUCCESS') {
          this.listOfUsernames = response.data as User[];
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
  arrivalTime: new FormControl( '',
  ),
  departureTime: new FormControl( '',{}
  ),
  arrivalDate: new FormControl( '',
    ),
    dep_date: new FormControl( '',{}
    ),
    contactNo: new FormControl( '',[Validators.required, Validators.pattern('^[0-9]{10}$')]
  ),
  selectedUsername: new FormControl('', ) 
  
});
OnSubmitAddVisitor() {
  let userID: string | undefined = undefined;
  let status: string | undefined = undefined;
  // console.log(this.selectedUsername)
  if (this.role?.toString() === "resident") {
    userID = this.user!.idUser;
    status = "Approved";
  
  } else if (this.role?.toString() === "guard") {
    status = "Pending";
    userID = this.form.value.selectedUsername!
  }

  const visitor: Visitor = {
    idVisitor: 'null',
    userId: userID!,
    name: this.form.value.name!,
    purpose: this.form.value.purpose!,
    arrivalTime: this.form.value.arrivalTime!,
    departureTime: this.form.value.departureTime!,
    dep_date: this.form.value.dep_date!,
    contactNo: this.form.value.contactNo!,
    arrivalDate: this.form.value.arrivalDate!,
    status: status!,
    token:'',
    qrCodeBase64: ''
  };

  if (this.form.valid) {
    const sub = this.visitorService.createVisitor(userID!, visitor).subscribe({
      next: (response: ResponseEntity) => {
        // console.log("Response from createVisitor: ", response);
        if (response.status.toString() === "SUCCESS") {
          alert("Visitor Added Successfully");
          this.addVisitorFormVisibility = false;
          const responseVisitor :Visitor = response.data as Visitor ;

          const qrCodeBase64 = responseVisitor.qrCodeBase64;
          this.qrCodeImage = 'data:image/png;base64,' + qrCodeBase64;
        }
      },
      error: (err) => {
        console.error("Error adding visitor: ", err);
      },
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}

//View All Visitor By Admin
listOfVisitors :Visitor[] =[];
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
listOfVisitorsByUser :Visitor[] =[];
onClickingViewVisitorByUser(){ 

  this.showTableByUsern = !this.showTableByUsern ;
  this.addVisitorFormVisibility = false;
  this.ViewPendingRequestsTable=false;
  
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
  listOfPendingRequests :Visitor[] =[];
  ViewPendingRequestsTable:boolean =false;  // showPendingRequests:boolean=false;
  onClickingManageRequests(){
     this.ViewPendingRequestsTable = !this.ViewPendingRequestsTable; 
     this.showTableByUsern = false ;
  this.addVisitorFormVisibility = false;
     if(this.ViewPendingRequestsTable) 
      this.FetchPendingRequestTableData()
     }
  FetchPendingRequestTableData(){
  const sub = this.visitorService.getVisitorByStatus(this.user!.idUser , "Pending").subscribe({
    
    next: (response:ResponseEntity) => {
      if(response.status.toString()==="SUCCESS"){
        this.listOfPendingRequests= response.data as Visitor[];
         console.log(this.listOfPendingRequests )
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
            this.listOfPendingRequests=[];
          }
      },
    });
    this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
  }

  //Verify Visitor by guard 
 // Variables for QR scanning and verification
 qrResultString: string = '';
 showScanner: boolean = false;
   
 // Toggle QR code scanner visibility
 toggleScanner() {
   this.showScanner = !this.showScanner;
 }

 // Handle QR code scan result
 onCodeResult(result: any) {
   this.qrResultString = result; // Save the scanned QR token
   this.verifyVisitor(result); // Verify the visitor based on the QR token
 }
 // Verify visitor status using QR code token
 verifyVisitor(qrCodeToken: string) {

  const sub=  this.visitorService.verifyVisitorByQRCode(qrCodeToken).subscribe({
     next: (response: ResponseEntity) => {
       if (response.status.toString() === 'SUCCESS') {
         const visitor = response.data as Visitor;

         if (visitor.status === 'Approved') {
          this.qrResultString= `Visitor Verified: ${visitor.name} is approved.` ;
         } else if (visitor.status === 'Pending') {
           this.qrResultString= `Visitor ${visitor.name}'s request is still pending.`
         } else {
          this.qrResultString= `Visitor ${visitor.name}'s request has been rejected.`;
         }
       } else {
         alert('Invalid QR code or visitor not found.');
       }
     },
     error: (err) => {
       console.error('Error verifying visitor:', err);
       alert('An error occurred while verifying the visitor.');
     },
   });
 }
}


  