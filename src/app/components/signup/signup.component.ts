import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth-services/auth.services';
import { Router } from '@angular/router';
import { loginResponse } from '../../models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  
  constructor(private authService: AuthService, private router: Router){

  }
  form = new FormGroup({
    email: new FormControl('', {
      validators : [Validators.email, Validators.required],
      asyncValidators :[]
    }),

    password : new FormControl('' ,{
      validators: [Validators.required, Validators.minLength(8)],
    }),

    username :new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15),]
    }),

    phoneNo : new FormControl('', {
      validators: []
    }),

    address : new FormControl('', {
      validators: [Validators.minLength(5)]
    }),

    userRole: new FormControl('', {
      validators : [Validators.required]
    })

  });

  OnRegister() : void {
    if(this.form.valid){

      const user : User={
        userName: this .form .value.username!,
        password: this.form.value.password!,
        email:this.form.value.email!,
        phoneNo:this.form.value.phoneNo!,
        address:this.form.value.address!,
        userRole: this.form.value.userRole!
      };
     this.authService.signup(user).subscribe({
      next: (response: loginResponse) :void=> {
        if(response.status.toString()==="SUCCESS")
        {
          if(user.userRole!="admin")
          {
            alert('Registered successfully, Please login to continue');
            this.router.navigate(['/login']);
          }
          else{
            //back to options
          }
        }
        else
        {
          //handle error try 
        }

      },
      error :() =>{
        //Handle observables error like when server is down

      }
     });
    //   this.authService.signup(user).subscribe( {
    //     next : (response: loginResponse):void =>{
    //       this.router.navigate(['/login']), 
    //     },
    //     error : {

    //     },
    // });

      
      
    }

  }

  get UserNameIsInvalid() {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.dirty &&
      this.form.controls.username.invalid
    );
  }
  get UserRoleIsInvalid() {
    return (
      this.form.controls.userRole.touched &&
      this.form.controls.userRole.dirty &&
      this.form.controls.userRole.invalid
    );
  }
  get EmailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
  get AddressIsInvalid() {
    return (
      this.form.controls.address.touched &&
      this.form.controls.address.dirty &&
      this.form.controls.address.invalid
    );
  }
  get PhoneNumberIsInvalid() {
    return (
      this.form.controls.phoneNo.touched &&
      this.form.controls.phoneNo.dirty &&
      this.form.controls.phoneNo.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }
}

export enum Roles {
  ADMIN = 'ADMIN',
  RESIDENT = 'RESIDENT',
  GUARD = 'GUARD',
  // Add other roles as needed
}
function userRoleValid(control: AbstractControl){
  const inputrole = String(control.value).trim();
  inputrole.toUpperCase;
  for(const role of Object.values(Roles)){
    if(role===inputrole)
      return {userRoleValid: true};
  }
  return null;
    
}

function userNameValid(control: AbstractControl){
  const username = String(control.value).trim();
  if(!/^[a-zA-Z0-9_-]+$/.test(username)){
    return null;
  }
  if (!/^[a-zA-Z]/.test(username)) {
    return null;
  }
  return {userNameValid:true};

}

function userNameIsUnique(control: AbstractControl){

}
function passwordChecks(control: AbstractControl){
  const password =String(control.value).trim();
  if(!/[A-Z]/.test(password)){
    return null;
  }
  if(!/[a-z]/.test(password)){
    return null;
  }
  if(!/\d/.test(password)){
    return null;
  }
  if(!/[@#$%^&+=]/.test(password)){
    return null;
  }
  return {passwordChecks:true};
}
