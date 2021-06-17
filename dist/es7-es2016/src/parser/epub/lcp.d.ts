/// <reference types="node" />
import { Encryption } from "./lcp-encryption";
import { Link } from "./lcp-link";
import { Rights } from "./lcp-rights";
import { Signature } from "./lcp-signature";
import { User } from "./lcp-user";
import { LSD } from "./lsd";
export declare function setLcpNativePluginPath(_: string): boolean;
export interface IDecryptedBuffer {
    buffer: Buffer;
    inflated: boolean;
}
export declare class LCP {
    ID: string;
    Provider: string;
    Issued: Date;
    Updated: Date;
    Encryption: Encryption;
    Rights: Rights;
    User: User;
    Signature: Signature;
    Links: Link[];
    ZipPath: string | undefined;
    JsonSource: string | undefined;
    LSD: LSD | undefined;
    ContentKey: Buffer | undefined;
    private _usesNativeNodePlugin;
    private _lcpNative;
    private _lcpContext;
    isNativeNodePlugin(): boolean;
    isReady(): boolean;
    init(): void;
    decrypt(encryptedContent: Buffer, linkHref: string, needsInflating: boolean): Promise<IDecryptedBuffer>;
    dummyCreateContext(): Promise<void>;
    tryUserKeys(lcpUserKeys: string[]): Promise<void>;
    private getCRLPem;
    private tryUserKey;
}
