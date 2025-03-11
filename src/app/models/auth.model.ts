import { HttpStatusCode } from "@angular/common/http"

export type loginResponse={ 
    status : ApiResponseStatus
    statusCode : HttpStatusCode,
     message :string,
     data :object
     error:object
}

export type ApiResponseStatus= {
    SUCCESS:string,
     ERROR: string;
}