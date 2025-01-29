import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user-services/user.services';
import { AuthService } from '../../services/auth-services/auth.services';
import { ResponseEntity } from '../../models/response.model';
import { Route, Router } from '@angular/router';
import { Roles } from '../signup/signup.component';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-user',
  standalone:true,
  imports: [NgIf,NgFor,NgxScannerQrcodeModule],
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

// UpdateUserOption() {
//   this.updateUserOption = !this.updateUserOption;
//   if (this.updateUserOption === true) {
//     this.onClickViewAllUsers(); // Function to fetch all users for the admin
//   }
// }

updateUserForm = new FormGroup({
 
  email: new FormControl('', {}),
  phone: new FormControl('', {}),
  address: new FormControl('', {}),
  password: new FormControl('', {}),
});

onSelectingUserUpdate(user: User) {
  // this.updateUserButton = !this.updateUserButton;
  this.selectedUserForUpdate = user;
  // this.updateUserButton = true;

  // Pre-fill the form with the selected user's values
  this.updateUserForm.setValue({
    email: user.email,
    phone: user.phoneNo,
    address: user.address,
    password: user.password
  });
}
   userID:string='';
// c) On clicking update, show update form
onClickingUpdateUserButton() {
  if (this.updateUserForm.valid && this.selectedUserForUpdate) {
 
    // Create a copy of the updated user
    const updatedUser: User = {
      ...this.selectedUserForUpdate,
      // Default to existing value
      email: this.updateUserForm.value.email ?? this.selectedUserForUpdate.email, // Default to existing value
      phoneNo: this.updateUserForm.value.phone ?? this.selectedUserForUpdate.phoneNo, // Default to existing value
      address: this.updateUserForm.value.address ?? this.selectedUserForUpdate.address, // Default to existing value
      password:  this.updateUserForm.value.password ?? this.selectedUserForUpdate.password
    };
    
    // if(this.currentUser?.userRole.toString()==='admin'){
    //  this.userID =null;
    // }
    // else
    // {
    //    this.userID=this.currentUser?.idUser;
    // }

    // Call the service to update the user
    const sub = this.userService.updateUser(this.userID!, updatedUser).subscribe({
      next: (response: ResponseEntity) => {
        if (response.status.toString() === 'SUCCESS') {
          alert('User Updated Successfully');
          this.updateUserButton = false;
          this.selectedUserForUpdate = null;
          this.updateUserOption = false;
        }
      },
    });
    // this.destroyRef.onDestroy(() => {
    //   sub.unsubscribe();
    // });
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
      this.codeVisiblity= !this.codeVisiblity;

    }
}
