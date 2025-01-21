import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Notice } from "../../models/notice.model";
import { ResponseEntity } from "../../models/response.model";

@Injectable({
    providedIn:'root'
})
export class NoticeService{
    private httpClient =inject(HttpClient);

    createNotice(notice: Notice) : Observable<ResponseEntity>{
        return this.httpClient.post<ResponseEntity>( "http://localhost:8080/notice", notice);
    }

    getAllNotice() :Observable<ResponseEntity>{
        return this.httpClient.post<ResponseEntity>( "http://localhost:8080/notices",{});
    }

    getNoticeByRole(role: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/notices/${role}`);
    }
    

    getNoticeById(id:string): Observable<ResponseEntity>{
        return this.httpClient.get<ResponseEntity>( `http://localhost:8080/notice/${id}`, {});
    }

    updateNotice(notice: Notice, id:string) :Observable<ResponseEntity>{
        
        return this.httpClient.patch<ResponseEntity>(   `http://localhost:8080/notice/${id}`, notice);
    }

    deleteNotice(id:string) :Observable<ResponseEntity>{
        
        return this.httpClient.delete<ResponseEntity>( `http://localhost:8080/notice/${id}`,{});
    }

}