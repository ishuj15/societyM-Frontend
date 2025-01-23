import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { loginResponse } from "../../models/auth.model";
import { User } from "../../models/user.model";
import { Roles } from "../../components/signup/signup.component";

@Injectable({
    providedIn:"root"
})
export class AuthService{
    private httpClient = inject(HttpClient);
    loggedIn$= signal<boolean>(false);
    role$ = signal<Roles| null>(null);

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