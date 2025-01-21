import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseEntity } from "../../models/response.model";
import { Alert } from "../../models/alert.model";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private httpClient = inject(HttpClient);

    createAlert(alert: Alert): Observable<ResponseEntity> {
        return this.httpClient.post<ResponseEntity>("http://localhost:8080/alert", alert);
    }

    getAllAlerts(): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>("http://localhost:8080/alerts");
    }

    getAlertsByRole(role: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/alerts/${role}`);
    }

    getAlertById(alertId: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/alert/${alertId}`);
    }

    updateAlert(alertId: string, alert: Alert): Observable<ResponseEntity> {
        return this.httpClient.patch<ResponseEntity>(`http://localhost:8080/alert/${alertId}`, alert);
    }

    deleteAlert(alertId: string): Observable<ResponseEntity> {
        return this.httpClient.delete<ResponseEntity>(`http://localhost:8080/alert/${alertId}`);
    }
}
