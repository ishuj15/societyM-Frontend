import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseEntity } from "../../models/response.model";
import { Visitor } from "../../models/visitor.model";

@Injectable({
    providedIn: 'root'
})
export class VisitorService {
    private httpClient = inject(HttpClient);

    createVisitor(userId: string, visitor: Visitor): Observable<ResponseEntity> {
        return this.httpClient.post<ResponseEntity>(`http://localhost:8080/visitor/${userId}`, visitor);
    }

    getAllVisitors(): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>("http://localhost:8080/visitors");
    }

    getVisitorsByUser(userId: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/visitors/${userId}`);
    }

    updateVisitor(visitorId: string, visitor: Visitor): Observable<ResponseEntity> {
        return this.httpClient.put<ResponseEntity>(`http://localhost:8080/visitor/${visitorId}`, visitor);
    }

    deleteVisitor(visitorId: string): Observable<ResponseEntity> {
        return this.httpClient.delete<ResponseEntity>(`http://localhost:8080/visitor/${visitorId}`);
    }

    getVisitorByStatus( userId:string, status :string ) : Observable<ResponseEntity>{
                                          
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/visitors/${userId}/${status}`);
        // return this.httpClient.get<ResponseEntity>(`http://localhost:8080/visitors/${userId}/status` , status );
    }
    updateVisitorStatus(visitorId: string, status :string ) :  Observable<ResponseEntity> {
        return this.httpClient.put<ResponseEntity>(`http://localhost:8080/visitor/update/${status}`, visitorId);    }

    verifyVisitorByQRCode(token: string) {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/visitor/verify/${token}`);
      }

}
