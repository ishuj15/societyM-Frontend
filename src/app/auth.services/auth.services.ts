import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { loginResponse } from "../models/auth.model";

@Injectable({
    providedIn:"root"
})
export class authService{
    private httpClient = inject(HttpClient);

    login(email: string, password: string) : Observable<loginResponse>{
        return this.httpClient.post<loginResponse>("http://localhost:8080/api/auth/login",{
            email:email,
             password:password});

    }
}