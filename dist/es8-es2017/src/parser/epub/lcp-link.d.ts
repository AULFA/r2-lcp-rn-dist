export declare class Link {
    Length: number;
    Href: string;
    Title: string;
    Type: string;
    Templated: boolean;
    Profile: string;
    Hash: string;
    Rel: string;
    HasRel(rel: string): boolean;
    SetRel(rel: string): void;
}
