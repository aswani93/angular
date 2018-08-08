export class Alert {
    type: AlertType;
    message: string;
}

export enum AlertType {
    Success,
    Error,
    Warning,
    loader,
    Info,
    Error_details,
    details,
    Logout,
    Success_details,
    autorf_success_details
   
}