import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseEntity } from "../../models/response.model";
import { User } from "../../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private httpClient = inject(HttpClient);

    createUser(user: User): Observable<ResponseEntity> {
        return this.httpClient.post<ResponseEntity>("http://localhost:8080/user", user);
    }

    getAllUsers(): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>("http://localhost:8080/users");
    }

    getUserById(userId: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/user/${userId}`);
    }

    updateUser(userId: string, user: User): Observable<ResponseEntity> {
        return this.httpClient.put<ResponseEntity>(`http://localhost:8080/user/${userId}`, user);
    }

    deleteUser(userId: string): Observable<ResponseEntity> {
        return this.httpClient.delete<ResponseEntity>(`http://localhost:8080/user/${userId}`);
    }
    getUserNames() :Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>("http://localhost:8080/userName");
    }

    getUserByUserName(userName:string):Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/user/userName/${userName}`);
    }
    
}
