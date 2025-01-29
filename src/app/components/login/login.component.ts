import { Component, DestroyRef, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth-services/auth.services';
import { loginResponse } from '../../models/auth.model';
import {  Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

import { jwtDecode } from 'jwt-decode';
import { User } from '../../models/user.model';
import base32Decode from "base32-decode";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , HeaderComponent],
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
        otp: new FormControl('' ,{
          validators: [Validators.required],
        }),
  })

//  onSubmit(): void{ 
//     if(this.form.valid){
//       const formUserName = this .form .value.username!
//       const formPassword = this.form.value.password!;
      
//       const sub = this.authService.login(formUserName ,formPassword).subscribe( {
//         next: (response:loginResponse) =>{
//           if(response.status.toString()==="SUCCESS")
//           {
//             const token = (response.data as any)['JWT Token'];
//             const decodeToken :{role:string} = jwtDecode( token);
//                 this.authService.loggedIn$.set(true);
//                 this.authService.user$.set(  response.error as User);
//                 this.authService.role$.set(this.authService.user$()?.userRole);
//                 localStorage.setItem('authToken', token);
//                 this.router.navigate(['/home/dashboard']);
//           }
//           else
//           {
//             alert("Couldn't login , Please try again");
//             this.router.navigate(['/login']);
//           }
//         },
//       });
//       this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
//     }

//   }
  async onSubmit(): Promise<void>{ 
    if(this.form.valid){
      const formUserName = this .form .value.username!
      const formPassword = this.form.value.password!;
      const otp= this.form.value.otp!;
      const sub = this.authService.login(formUserName ,formPassword).subscribe( {
        next: async (response:loginResponse) =>{
          if(response.status.toString()==="SUCCESS")
          {
            const token = (response.data as any)['JWT Token'];
           
            const decodeToken :{role:string} = jwtDecode( token);
            const user = response.error as User;
            const secret = user.qrToken;
            console.log("secret"+ secret);
            const generatedOTP = await generateTOTP(secret); 
       
          console.log(generatedOTP)
            if(generatedOTP===otp){
                this.authService.loggedIn$.set(true);
                this.authService.user$.set(  response.error as User);
                this.authService.role$.set(this.authService.user$()?.userRole);
                // console.log()
                localStorage.setItem('authToken', token);
                this.router.navigate(['/home/dashboard']);
              }
              else{
                alert("Couldn't login , Please try again");
                this.router.navigate(['/login']);
              }

          }
          else
          {
            alert("Couldn't login , Please try again");
            this.router.navigate(['/login']);
          }
        },
      });
      this.destroyRef.onDestroy(()=>{  sub.unsubscribe();  });
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

// Function to generate TOTP
async function generateTOTP(secret: string): Promise<string> {
  const keyBytes = base32Decode(secret, "RFC4648"); 
  const time = Math.floor(Date.now() / 1000 / 30);  // 30-second intervals
 // Convert time to a byte array (BigEndian)
 const timeBuffer = new ArrayBuffer(8);
 const timeView = new DataView(timeBuffer);
 timeView.setUint32(0, Math.floor(time / Math.pow(2, 32)));
 timeView.setUint32(4, time & 0xffffffff);

 // HMAC SHA1 using Web Crypto API
 const cryptoKey = await crypto.subtle.importKey(
   "raw",
   new Uint8Array(keyBytes),  // Use decoded bytes, not the Base32 string!
   { name: "HMAC", hash: { name: "SHA-1" } },
   false,
   ["sign"]
 );

 const signature = await crypto.subtle.sign("HMAC", cryptoKey, timeBuffer);

 // Convert signature to a number
 const signatureArray = new Uint8Array(signature);
 const offset = signatureArray[signatureArray.length - 1] & 0xf;
 const otp = ((signatureArray[offset] & 0x7f) << 24) |
             ((signatureArray[offset + 1] & 0xff) << 16) |
             ((signatureArray[offset + 2] & 0xff) << 8) |
             (signatureArray[offset + 3] & 0xff);

 return (otp % 1000000).toString().padStart(6, "0"); // Return 6-digit OTP
}



