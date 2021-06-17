export declare type AnyJson = JsonPrimitives | JsonArray | JsonMap;
export declare type JsonPrimitives = string | number | boolean | null;
export interface JsonMap {
    [key: string]: AnyJson;
}
export interface JsonArray extends Array<AnyJson> {
}
export declare const KeyToPreserveUnknownJSON = "AdditionalJSON";
export interface IWithAdditionalJSON {
    [KeyToPreserveUnknownJSON]: JsonMap | undefined;
}
declare type TConstructor<T> = new (value?: any) => T;
export declare function TaJsonDeserialize<T>(json: any, type: TConstructor<T>): T;
export declare function TaJsonSerialize<T>(obj: T): JsonMap;
export {};
