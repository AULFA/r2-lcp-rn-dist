export declare class Encrypted {
    Scheme: string;
    Profile: string;
    Algorithm: string;
    Compression: string;
    OriginalLength2: number;
    OriginalLength1: number | undefined;
    get OriginalLength(): number | undefined;
    set OriginalLength(length: number | undefined);
    DecryptedLengthBeforeInflate: number;
    CypherBlockPadding: number;
    CypherBlockIV: string | undefined;
}
