import { Roles } from "../components/signup/signup.component";

export interface User {
    id:string,
    email:string,
    password:string,
    address:string,
    phoneNo:string,
    userRole:Roles,
    userName: string
}