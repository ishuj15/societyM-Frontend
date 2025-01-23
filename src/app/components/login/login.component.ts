import { Component, DestroyRef, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth-services/auth.services';
import { loginResponse } from '../../models/auth.model';
import {  Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { Roles } from '../signup/signup.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private destroyRef=inject(DestroyRef);
  constructor(private authService: AuthService , private router :Router){

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
    
      const sub = this.authService.login(formUserName ,formPassword).subscribe( {
        next: (response:loginResponse) =>{
          if(response.status.toString()==="SUCCESS")
          {
            localStorage.setItem('authToken', (response.data as any )['JWT Token']);
            const decodeToken :{role:string} = jwtDecode( (response.data as any)['JWT Token']);
            this.authService.loggedIn$.set(true);
            this.authService.role$.set(decodeToken.role as Roles);

            
            this.router.navigate(['/home/dashboard']);
          }
          else
          {
            alert("Couldn't login , Please try again");
            this.router.navigate(['/login']);

          }
        },

        error :() =>{

        }
       
      });
      this.destroyRef.onDestroy(()=>{
        sub.unsubscribe();
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
