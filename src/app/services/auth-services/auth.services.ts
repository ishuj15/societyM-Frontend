import {  Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { loginResponse } from "../../models/auth.model";
import { User } from "../../models/user.model";
import { Roles } from "../../components/signup/signup.component";
import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    constructor(   private httpClient: HttpClient) {
      if(this.loggedIn$()){
        this.fetchUser();
        console.log(this.user$())
      }

    }
  
    loggedIn$= signal<boolean>(this.hasValidToken());
    role$ = signal<Roles| undefined>(undefined);
    user$ = signal<User |null>(null);
  
    private hasValidToken(): boolean {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
          return false;
        }
    
        try {
          const decodedToken: { exp: number } = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
          // Check if the token has expired
          return decodedToken.exp > currentTime;
        } catch (error) {
          // In case of any error (invalid token format, decoding issues), treat it as invalid
          return false;
        }
      }
    

    login(username: string, password: string) : Observable<loginResponse>{
       
        return this.httpClient.post<loginResponse>("http://localhost:8080/api/auth/login",{
            username:username,
             password:password});
    }

    signup(user: User) : Observable<loginResponse>{
       console.log(user);
        return this.httpClient.post<loginResponse>( "http://localhost:8080/api/auth/user",
            user 
        );
    }

    fetchUser(){
      const token= localStorage.getItem('authToken');
      
     if(!token)
      return false;
      
    else {
      try {
        const decodedToken: {role:string,  sub: string } = jwtDecode(token);
        const userName= decodedToken.sub;
        this.httpClient.get<loginResponse>(`http://localhost:8080/user/userName/${userName}`, ).pipe(
            tap( (response:loginResponse)=>{
                    if(response.status.toString()==="SUCCESS"){
                      const user= response.data as User;
                      this.loggedIn$.set(true);
                      this.user$.set(user)
                      this.role$.set(user.userRole as Roles);
                    }    }
                    )) .subscribe();
    } catch (error) {
      console.error('Error decoding token:', error);
    }
      return true;
    }
    } 
}