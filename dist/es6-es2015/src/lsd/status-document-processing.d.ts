import { LCP } from "../parser/epub/lcp";
import { IDeviceIDManager } from "./deviceid-manager";
export declare function launchStatusDocumentProcessing(lcp: LCP, deviceIDManager: IDeviceIDManager, onStatusDocumentProcessingComplete: (licenseUpdateJson: string | undefined) => void, httpHeaders?: {
    [key: string]: string;
}): Promise<void>;
