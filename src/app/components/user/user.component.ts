import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user-services/user.services';
import { AuthService } from '../../services/auth-services/auth.services';
import { ResponseEntity } from '../../models/response.model';
import { Route, Router } from '@angular/router';
import { Roles } from '../signup/signup.component';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-user',
  standalone:true,
  imports: [NgIf,NgFor,NgxScannerQrcodeModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  currentUser:User|null=null;
  role : Roles|null | undefined =null;
  constructor(private userService: UserService, private authService:AuthService , private router: Router) {}
  
  qrCodeImage: string | null = null;
  qrCodqrCodeBase64: string | null = null;

  ngOnInit(): void {
    this.currentUser= this.authService.user$();
    this.role = this.authService.role$();
    console.log(this.role)
   const  qrCodeBase64 = this.currentUser?.qrImage;
    this.qrCodeImage = qrCodeBase64 ? 'data:image/png;base64,' + qrCodeBase64 : null;
  }

  viewProfile:boolean=false;
  onClickViewProfile(){
    this.viewProfile=!this.viewProfile;
  }

  //view all user by admin --working
  viewUserOption :boolean=false;
  users: User[]=[]
  onclickViewUSer(){
    this.viewUserOption= ! this.viewUserOption;
    this.codeVisiblity=false;
  this.viewAllUsers();
  }
  viewAllUsers() {
   const sub = this.userService.getAllUsers().subscribe( {
      next: (response: ResponseEntity) =>{
        this.users=response.data as User[];
      }
    });
  }
// 5. Update User 
// a) Showing table to select for update
selectedUserForUpdate: User | null = null;
updateUserButton: boolean = false;
updateUserOption: boolean = false;
updateFormVisibility:boolean=false;
 userId:string='';
//by residnet or guard
UpdateUserOption() {
  this.updateUserOption = !this.updateUserOption;

  if (this.updateUserOption ) {
    this.updateFormVisibility=true;
    this.updateUserButton=true;
    this.userId=this.currentUser?.idUser!;
    this.updateUserForm.setValue({
      email: this.currentUser!.email,
      phoneNo: this.currentUser!.phoneNo,
      address:this.currentUser!.address,
      password: null
    });
  }
  else
  {
    this.updateFormVisibility=false;
  }
}

updateUserForm = new FormGroup({
 
  email: new FormControl('', {}),
  phoneNo: new FormControl('', {}),
  address: new FormControl('', {}),
  password: new FormControl('', {}),
});

//By admin
onSelectingUserUpdate(user: User) {
  this.updateFormVisibility=true;
  // this.updateUserButton = !this.updateUserButton;
  this.selectedUserForUpdate = user;
  this.updateUserButton = true;
  this.userId= user.idUser;

  // Pre-fill the form with the selected user's values
  this.updateUserForm.setValue({
      email: this.currentUser!.email,
      phoneNo: this.currentUser!.phoneNo,
      address:this.currentUser!.address,
      password: null
    });
}
  
// c) On clicking update, show update form
onClickingUpdateUserButton() {
  if (this.updateUserForm.valid ) {
    // Create a copy of the updated user
    const updatedUser: User = {
      // Default to existing value
      email: this.updateUserForm.value.email!, // Default to existing value
      phoneNo: this.updateUserForm.value.phoneNo!, // Default to existing value
      address: this.updateUserForm.value.address!, // Default to existing value
      password: this.updateUserForm.value.password?? this.currentUser?.password?? "",
      idUser: '',
      userRole: Roles.RESIDENT,
      userName: '',
      qrToken: '',
      qrImage: ''
    };
   
   
    const sub = this.userService.updateUser(this.userId, updatedUser).subscribe({
    
      next: (response: ResponseEntity) => {
        if (response.status.toString() === 'SUCCESS') {
          alert('User Updated Successfully');
          this.updateUserButton = false;
          this.selectedUserForUpdate = null;
          this.updateUserOption = false;
          this.updateFormVisibility=false;
        }
      },
    });
    // this.destroyRef.onDestroy(() => {
    //   sub.unsubscribe();
    // });
  }
}

deleteUserConfirmation(userId:string){
  if(window.confirm('Do you really want to delete?')){
    this.deleteUser(userId);
  }

}
  //delete user  --working
  deleteUser(userId:string): void {
    const sub=  this.userService.deleteUser(userId).subscribe(
      {
        next: (response:ResponseEntity) =>{
          if(response.status.toString() ==="SUCCESS")
          {
            alert("Account deleted succuessfully");
            if(this.role?.toString()!='admin')
            this.router.navigate(['/landing']);
          else{
            this.viewUserOption=false;
          }
          }
        }
      });
    }
    //View qr code

    codeVisiblity:boolean=false;
    onClickViewQr(){
      this.viewUserOption=false;
      this.codeVisiblity= !this.codeVisiblity;

    }
}
