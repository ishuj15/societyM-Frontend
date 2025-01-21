import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseEntity } from "../../models/response.model";
import { Complaint } from "../../models/complaint.model";

@Injectable({
    providedIn: 'root'
})
export class ComplaintService {
    private httpClient = inject(HttpClient);

    createComplaint(userId: string, complaint: Complaint): Observable<ResponseEntity> {
        return this.httpClient.post<ResponseEntity>(`http://localhost:8080/complaint/${userId}`, complaint);
    }

    getAllComplaints(): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>("http://localhost:8080/complaints");
    }

    getComplaintsByUser(userId: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/complaints/${userId}`);
    }

    getComplaintById(complaintId: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/complaint/${complaintId}`);
    }

    updateComplaint(complaintId: string, complaint: Complaint): Observable<ResponseEntity> {
        return this.httpClient.patch<ResponseEntity>(`http://localhost:8080/complaint/${complaintId}`, complaint);
    }

    deleteComplaint(complaintId: string): Observable<ResponseEntity> {
        return this.httpClient.delete<ResponseEntity>(`http://localhost:8080/complaint/${complaintId}`);
    }
}
