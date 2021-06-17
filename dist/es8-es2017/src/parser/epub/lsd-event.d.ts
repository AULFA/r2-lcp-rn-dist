export declare enum TypeEnum {
    Register = "register",
    Renew = "renew",
    Return = "return",
    Revoke = "revoke",
    Cancel = "cancel"
}
export declare class LsdEvent {
    Type: string;
    Name: string;
    ID: string;
    TimeStamp: Date;
}
