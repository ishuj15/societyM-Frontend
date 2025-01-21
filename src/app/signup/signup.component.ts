import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators : [Validators.email, Validators.required],
      asyncValidators :[]
    }),

    password : new FormControl('' ,{
      validators: [Validators.required, Validators.minLength(8), passwordChecks],
    }),

    username :new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15),]
    }),

    phoneNo : new FormControl('', {
      validators: [Validators.minLength(10), Validators.maxLength(10)]
    }),

    address : new FormControl('', {
      validators: [Validators.minLength(5)]
    }),

    userRole: new FormControl('', {
      validators : [Validators.required]
    })

  });
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
