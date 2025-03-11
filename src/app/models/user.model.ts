import { Roles } from "../components/signup/signup.component";

export interface User {
    idUser:string,
    email:string,
    password:string,
    address:string,
    phoneNo:string,
    userRole:string,
    userName: string
    qrToken:string,
    qrImage:string
}