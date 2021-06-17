import { Encrypted } from "../models/metadata-encrypted";
import { LCP } from "../parser/epub/lcp";
import { IStreamAndLength } from "r2-utils-rn/dist/es6-es2015/src/_utils/zip/zip";
export interface ICryptoInfo {
    length: number;
    padding: number;
}
export declare function supports(lcp: LCP, _linkHref: string, linkPropertiesEncrypted: Encrypted): boolean;
export declare function transformStream(lcp: LCP, linkHref: string, linkPropertiesEncrypted: Encrypted, stream: IStreamAndLength, isPartialByteRangeRequest: boolean, partialByteBegin: number, partialByteEnd: number): Promise<IStreamAndLength>;
export declare function getDecryptedSizeStream(lcp: LCP, stream: IStreamAndLength): Promise<ICryptoInfo>;
