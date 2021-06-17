import { LSD } from "../parser/epub/lsd";
import { IDeviceIDManager } from "./deviceid-manager";
export declare function lsdReturn(lsdJSON: any, deviceIDManager: IDeviceIDManager, httpHeaders?: {
    [key: string]: string;
}): Promise<any>;
export declare function lsdReturn_(lsd: LSD, deviceIDManager: IDeviceIDManager, httpHeaders?: {
    [key: string]: string;
}): Promise<LSD>;
