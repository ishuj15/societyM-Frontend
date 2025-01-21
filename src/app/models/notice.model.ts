export interface Notice {
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