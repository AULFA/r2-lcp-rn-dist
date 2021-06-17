import { LSD } from "../parser/epub/lsd";
import { IDeviceIDManager } from "./deviceid-manager";
export declare function lsdRenew(end: Date | undefined, lsdJSON: any, deviceIDManager: IDeviceIDManager, httpHeaders?: {
    [key: string]: string;
}): Promise<any>;
export declare function lsdRenew_(end: Date | undefined, lsd: LSD, deviceIDManager: IDeviceIDManager, httpHeaders?: {
    [key: string]: string;
}): Promise<LSD>;
