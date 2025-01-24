// export interface Notice {
//     title:string,
//     message: string, 
//     targetRole: TargetRole,
//     date: string
// }
export interface DatabaseNotice {
    idNotices:string,
    title:string,
    message: string, 
    targetRole: TargetRole,
    date: string
}
export enum TargetRole{
    RESIDENT = 'RESIDENT',
    GUARD = 'GUARD',
    ALL="ALL"
}