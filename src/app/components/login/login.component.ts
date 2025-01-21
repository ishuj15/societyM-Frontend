import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth-services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService){

  }
  form = new FormGroup({
    username: new FormControl('', {
          validators : [ Validators.required],
          asyncValidators :[]
        }),
    
        password : new FormControl('' ,{
          validators: [Validators.required, Validators.minLength(8)],
        }),
  })

  onSubmit(): void { 
    if(this.form.valid){
      const formUserName = this .form .value.username!
      const formPassword = this.form.value.password!;
      this.authService.login(formUserName ,formPassword).subscribe( response => {
        //const token= response.data['jwtToken']
          
      });
    }

  }

  get UserNameIsInvalid() {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.dirty &&
      this.form.controls.username.invalid
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