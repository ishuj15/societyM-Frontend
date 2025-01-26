import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ResponseEntity } from "../../models/response.model";
import { DatabaseNotice } from "../../models/notice.model";

@Injectable({
    providedIn:'root'
})
export class NoticeService{
    private httpClient =inject(HttpClient);

    createNotice(notice: DatabaseNotice) : Observable<ResponseEntity>{
        return this.httpClient.post<ResponseEntity>( "http://localhost:8080/notice", notice);
    }

    getAllNotice() :Observable<ResponseEntity>{
        return this.httpClient.get<ResponseEntity>( "http://localhost:8080/notices",{});
    }

    getNoticeByRole(role: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/notices/${role}`);
    }
    

    getNoticeById(id:string): Observable<ResponseEntity>{
        return this.httpClient.get<ResponseEntity>( `http://localhost:8080/notice/${id}`, {});
    }

    updateNotice( id:string ,notice: DatabaseNotice) :Observable<ResponseEntity>{
        
        return this.httpClient.put<ResponseEntity>(   `http://localhost:8080/notice/${id}`, notice);
    }

    deleteNotice(id:string) :Observable<ResponseEntity>{
        return this.httpClient.delete<ResponseEntity>( `http://localhost:8080/notice/${id}`,{});
    }

}