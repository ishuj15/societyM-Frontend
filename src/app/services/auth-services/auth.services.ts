import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { loginResponse } from "../../models/auth.model";
import { User } from "../../models/user.model";

@Injectable({
    providedIn:"root"
})
export class AuthService{
    private httpClient = inject(HttpClient);
    

    login(username: string, password: string) : Observable<loginResponse>{
       
        return this.httpClient.post<loginResponse>("http://localhost:8080/api/auth/login",{
            username:username,
             password:password});
    }

    signup(user: User) : Observable<loginResponse>{
       
        return this.httpClient.post<loginResponse>( "http://localhost:8080/api/auth/user",
            user
        );
    }
}