import { Component, DestroyRef, inject } from '@angular/core';
import { ResponseEntity } from '../../models/response.model';
import { Services } from '../../models/service.model';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TargetRole } from '../../models/notice.model';
import { AuthService } from '../../services/auth-services/auth.services';
import { Roles } from '../signup/signup.component';
import { ServicesServiceM } from '../../services/servicesM-services/servicesm.servcies';
import { User } from '../../models/user.model';
import { NgFor, NgIf } from '@angular/common';
 
@Component({
  selector: 'app-services',
  standalone:true,
  imports: [ ReactiveFormsModule,NgIf, NgFor],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
 })
export class ServicesComponent {
  constructor(private authService: AuthService, private serviceService: ServicesServiceM, private router: Router) { }

  private destroyRef = inject(DestroyRef);
  role: Roles | null = null;
  user:User|null=null;
  services: Services[] = [];

  ngOnInit() {
    this.role = this.authService.role$()!;
    this.user=this.authService.user$()!;
  }

  // 1. Adding Service by user only
  isAddServiceVisible: boolean = false;

 
  onClickingAddService() {
    this.isAddServiceVisible = !this.isAddServiceVisible;
    if (this.isAddServiceVisible) {
      this.ShowTableToUser = false;
      this.showTableAdmin = false;
      this.deleteButton = false;
      this.updateButton = false;
      this.updateOption = false;
      this.deleteOption = false;
    }
  }

  form = new FormGroup({
    serviceName: new FormControl('', {}),
    description: new FormControl('', {}),
    targetRole: new FormControl<TargetRole | null>(null, {}),
    contact:  new FormControl('', {}),
    status: new FormControl('', {}),
  });

  onSubmitNewService() {
    if (this.form.valid) {
      const service: Services = {
        idServices: 'null',
        userId:this.user?.idUser!,
        serviceName: this.form.value.serviceName!,
        description: this.form.value.description!,
        status: this.form.value.status!,
        contact:this.form.value.contact!,
      
      };

      this.isAddServiceVisible = true;
      console.log(this.user?.idUser!);
      const sub = this.serviceService.createService( this.user?.idUser!  ,service).subscribe({
        next: (response: ResponseEntity) => {
          if (response.status.toString() === "SUCCESS") {
            alert("Service Created Successfully");
            this.isAddServiceVisible = false;
            this.ShowTableToUser = false;
            this.showTableAdmin = false;
            this.deleteButton = false;
            this.updateButton = false;
            this.updateOption = false;
            this.deleteOption = false;
          }
        },
      });
      this.destroyRef.onDestroy(() => { sub.unsubscribe(); });
    }
  }

  // 2. Viewing Services by resident (user specific)
  ShowTableToUser: boolean = false;
  onClickingViewServiceUser() {
    this.ShowTableToUser = !this.ShowTableToUser;
    if (this.ShowTableToUser) {
      this.onFetchingServicesUser();
      this.deleteButton = false;
      this.updateButton = false;
      this.updateOption = false;
      this.deleteOption = false;
      this.isAddServiceVisible = false;
   
      this.selectedService = null;
    }
  }

  onFetchingServicesUser() {
    const sub = this.serviceService.getServicesByUser(this.user?.idUser!).subscribe({
      next: (response: ResponseEntity) => {
        if (response.status.toString() === "SUCCESS") {
          this.services = response.data as Services[];
        }
      },
    });
    this.destroyRef.onDestroy(() => { sub.unsubscribe(); });
  }

  // 3. Viewing Services by admin
  showTableAdmin: boolean = false;
  onClickingViewServiceAdmin() {
    this.showTableAdmin = !this.showTableAdmin;
    if (this.showTableAdmin) {
      this.ShowTableToUser = false;
      this.deleteButton = false;
      this.updateButton = false;
      this.updateOption = false;
      this.deleteOption = false;
      this.isAddServiceVisible = false;
      
      this.selectedService = null;
      this.onFetchingServicesAdmin();
    }
    // else{
    //   this.showTableAdmin=false
    // }
  }

  onFetchingServicesAdmin() {
    const sub = this.serviceService.getAllServices().subscribe({
      next: (response: ResponseEntity) => {
        if (response.status.toString() === "SUCCESS") {
          this.services = response.data as Services[];
        }
      },
    });
    this.destroyRef.onDestroy(() => { sub.unsubscribe(); });
  }

  // 4. Delete Service by admin only
  deleteOption: boolean = false;
  onClickingDeleteOption() {
    this.deleteOption = !this.deleteOption;
    if (this.deleteOption) {
      this.showTableAdmin =false ;
      this.ShowTableToUser = true;
      this.deleteButton = false;
      this.updateButton = false;
      this.updateOption = false;
      this.isAddServiceVisible = false;
      this.onFetchingServicesAdmin();
    }
  }

  selectedService:Services | null = null;
  deleteButton: Boolean = false;
  
  onClickingDeleteButton() {
    const sub = this.serviceService.deleteService(this.selectedService!.idServices).subscribe({
      next: (response: ResponseEntity) => {
        if (response.status.toString() === "SUCCESS") {
          alert("Service Deleted Successfully");
          this.ShowTableToUser = false;
          this.showTableAdmin = false;
          this.deleteButton = false;
          this.updateButton = false;
          this.updateOption = false;
          this.deleteOption = false;
          this.isAddServiceVisible = false;
          this.selectedService = null;
        }
      }
    });
    this.destroyRef.onDestroy(() => { sub.unsubscribe(); });
  }
  
  onCancel() {

    if(this.deleteOption)
    {
      this.deleteButton = false;
      this.selectedService = null;
    }
    else if(this.updateOption)
    {
      this.updateButton = false;
      this.selectedService = null;
    }
  }
  onSelectingService(service: Services) {
    // for delete
    if(this.deleteOption)
      this.deleteButton=true;
// for update
   else  if(this.updateOption)
    {
      this.updateButton=true;
      this.showTableAdmin = false;
      this.deleteButton = false;
      this.updateForm.setValue({
        serviceName: service.serviceName!,
        description: service.description,
       status:service.status
      });
      
   }
    this.selectedService = service;
    this.isAddServiceVisible = false;
  }

  // 5. Update Service
  // selectedServiceForUpdate: Services | null = null;
  updateButton: Boolean = false;
  updateOption: Boolean = false;
  UpdateServiceOption() {
    this.updateOption = !this.updateOption;
    if (this.updateOption) {
      this.showTableAdmin =false ;
      this.ShowTableToUser =true ;
      this.deleteButton = false;
      this.updateButton = false;
      this.deleteOption = false;
      this.isAddServiceVisible = false;
      this.onFetchingServicesAdmin();
    }
  }

  updateForm = new FormGroup({
    serviceName: new FormControl('', {}),
    description: new FormControl('', {}),
    status: new FormControl('', {}),
  });

 

  onClickingUpdateButton() {
    if (this.updateForm.valid && this.selectedService) {
      const updatedService: Services = {
        ...this.selectedService,
        serviceName: this.updateForm.value.serviceName ?? this.selectedService.serviceName,
        description: this.updateForm.value.description ?? this.selectedService.description,
        status: this.updateForm.value.status ?? this.selectedService.status,
      };

      const sub = this.serviceService.updateService(this.selectedService.idServices, updatedService).subscribe({
        next: (response: ResponseEntity) => {
          if (response.status.toString() === 'SUCCESS') {
            alert('Service Updated Successfully');
            this.updateButton = false;
            this.selectedService = null;
            this.updateOption = false;
            this.showTableAdmin = false;
          }
        },
      });
      this.destroyRef.onDestroy(() => { sub.unsubscribe(); });
    }
  }

}
