import { HttpStatusCode } from "@angular/common/http"
// import { ApiResponseStatus } from "./auth.model"

// export type SuccessResponse ={
//      status : ApiResponseStatus
//      message :string,
//      data :object
//      statusCode : HttpStatusCode,
//     }
// export type ErrorResponse ={
//     status : ApiResponseStatus
//     message :string,
//     data :object
//     error:object
//     statusCode : HttpStatusCode,
// }
export type ResponseEntity ={
    status : ApiResponseStatus
    message :string,
    data :object
    error:object
    statusCode : HttpStatusCode,
}
export type ApiResponseStatus= {
    SUCCESS:string,
     ERROR: string;
}