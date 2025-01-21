import { TargetRole } from "./notice.model";

export interface Alert {
    idAlert: string;
    message: string;
    date: Date; // Use string for date format (can be Date type if using proper date handling)
    targetRole: TargetRole;
}
