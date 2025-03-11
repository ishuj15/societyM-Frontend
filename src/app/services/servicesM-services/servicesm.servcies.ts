import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseEntity } from "../../models/response.model";
import { Services } from "../../models/service.model";

@Injectable({
    providedIn: 'root'
})
export class ServicesServiceM {
    private httpClient = inject(HttpClient);

    createService(userId: string, service: Services): Observable<ResponseEntity> {
        return this.httpClient.post<ResponseEntity>(`http://localhost:8080/service/${userId}`, service);
    }

    getAllServices(): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>("http://localhost:8080/services");
    }

    getServicesByUser(userId: string): Observable<ResponseEntity> {
        return this.httpClient.get<ResponseEntity>(`http://localhost:8080/services/${userId}`);
    }

    updateService(serviceId: string, service: Services): Observable<ResponseEntity> {
        return this.httpClient.put<ResponseEntity>(`http://localhost:8080/service/${serviceId}`, service);
    }

    deleteService(serviceId: string): Observable<ResponseEntity> {
        return this.httpClient.delete<ResponseEntity>(`http://localhost:8080/service/${serviceId}`);
    }
}
