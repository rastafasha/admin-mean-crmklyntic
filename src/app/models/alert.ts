

export class Alert {
    id: string = "";
    type: AlertType = AlertType.Info;
    title: string = "Nuevo Mensaje";
    message: string = "Ok.";
    time: number = Date.now();
    autoClose: boolean = false;
    keepAfterRouteChange: boolean = true;
    fade: boolean = false;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}
