import { LCP } from "../parser/epub/lcp";
export declare function lsdLcpUpdate(lcp: LCP, httpHeaders?: {
    [key: string]: string;
}): Promise<string>;
