import { Link } from "./lcp-link";
import { LsdEvent } from "./lsd-event";
import { PotentialRights } from "./lsd-potential-rights";
import { Updated } from "./lsd-updated";
export declare enum StatusEnum {
    Ready = "ready",
    Active = "active",
    Revoked = "revoked",
    Returned = "returned",
    Cancelled = "cancelled",
    Expired = "expired"
}
export declare class LSD {
    ID: string;
    Status: string;
    Message: string;
    Updated: Updated;
    Links: Link[];
    PotentialRights: PotentialRights;
    Events: LsdEvent[];
}
