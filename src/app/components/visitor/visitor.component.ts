import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-services/auth.services';
import { VisitorService } from '../../services/visitor-services/visitor.services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Visitor } from '../../models/visitor.model';
import { ResponseEntity } from '../../models/response.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-visitor',
  standalone:true,
  imports: [NgIf,NgFor,ReactiveFormsModule],
  templateUrl: './visitor.component.html',
  styleUrl: './visitor.component.css'
})
export class VisitorComponent {

constructor(private authService: AuthService, private visitorService: VisitorService){
  
this.usedId= this.authService.user$()?.id!;

}
 //variables
  usedId:string;
  
  listOfVisitors :Visitor[] =[];
  listOfPendingRequests :Visitor[] =[];
  listOfVisitorsByUser :Visitor[] =[];
 
  selectedVisitorId=signal<string | null>(null);
  // selectedVisitor=signal<Visitor | null>(null);
 

  //Adding New Visitor 
  addVisitorFormVisibility: boolean =false;
  onClickingAddVisitor(){ this.addVisitorFormVisibility=!this.addVisitorFormVisibility; }
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
  
});
  OnSubmitAddVisitor(){
    
    const visitor : Visitor={
      idVisitor:'null',
      userId: this.authService.user$()?.id! ,
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
      const sub = this.visitorService.createVisitor(this.usedId, visitor).subscribe({
        next : (response:ResponseEntity)=>
        {
          if(response.status.toString()==="SUCCESS")
          {
            alert("Visitor Added Successfully");
            this.addVisitorFormVisibility=false;
          }
          else
          {
            //error from backend
          }

        },
        error :() =>{
          //error from observable
        }
      });
    }
  }

//View All Visitor By Admin
showTableByAdmin: boolean=false;
onViewAllVisitorByAdmin(){this.showTableByAdmin = !this.showTableByAdmin;   this.ViewAllVisitorByAdmin()}
  ViewAllVisitorByAdmin(){
    const sub = this.visitorService.getAllVisitors().subscribe({
      next: (response: ResponseEntity) =>{
        if(response.status.toString()==="SUCCESS")
        {
          this.listOfVisitors= response.data as Visitor[];
        }
        else{
          //backend error
        }        
      },
      error:() =>{
        //observable error
      }
    });
  }

//View All Vistor By User
showTableByUsern: boolean=false;

onClickingViewVisitorByUser(){ 
  this.showTableByUsern = !this.showTableByUsern ;
  this.onViewAllVisitorByUser(); 
 }

  onViewAllVisitorByUser(){
    console.log(this.authService.user$()?.id);
    const sub = this.visitorService.getVisitorsByUser(this.usedId) . subscribe({
      next: (response: ResponseEntity) =>{
        if(response.status.toString()==="SUCCESS")
          {
          this.listOfVisitorsByUser= response.data as Visitor[];
          console.log(  this.listOfVisitorsByUser);
        }     
      },
    });
  }

  //Managing Request By visitor
  //1. Showing Pending requests data
  
  ViewPendingRequestsTable:boolean =false;  // showPendingRequests:boolean=false;
  onClickingManageRequests(){ this.ViewPendingRequestsTable = !this.ViewPendingRequestsTable; if(this.ViewPendingRequestsTable) this.FetchPendingRequestTableData() }
  FetchPendingRequestTableData(){
  const sub = this.visitorService.getVisitorByStatus(this.usedId , "pending").subscribe({
    next: (response:ResponseEntity) => {
      if(response.status.toString()==="SUCCESS"){
        this.listOfPendingRequests= response.data as Visitor[];
      }
    }
  });
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

  }

}
