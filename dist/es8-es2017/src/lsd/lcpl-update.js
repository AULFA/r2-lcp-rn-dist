"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lsdLcpUpdate = void 0;
const debug_ = require("debug");
const moment = require("moment");
const follow_redirects_1 = require("follow-redirects");
const BufferUtils_1 = require("r2-utils-rn/dist/es8-es2017/src/_utils/stream/BufferUtils");
const debug = debug_("r2:lcp#lsd/lcpl-update");
const IS_DEV = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev");
async function lsdLcpUpdate(lcp, httpHeaders) {
    if (!lcp.LSD) {
        return Promise.reject("LCP LSD data is missing.");
    }
    if (lcp.LSD.Updated && lcp.LSD.Updated.License &&
        (lcp.Updated || lcp.Issued)) {
        const updatedLicenseLSD = moment(lcp.LSD.Updated.License);
        const updatedLicense = moment(lcp.Updated || lcp.Issued);
        const forceUpdate = false;
        if (forceUpdate ||
            (updatedLicense.isBefore(updatedLicenseLSD))) {
            if (IS_DEV) {
                debug("LSD license updating...");
            }
            if (lcp.LSD.Links) {
                const licenseLink = lcp.LSD.Links.find((link) => {
                    return link.Rel === "license";
                });
                if (!licenseLink) {
                    return Promise.reject("LSD license link is missing.");
                }
                if (IS_DEV) {
                    debug("OLD LCP LICENSE, FETCHING LSD UPDATE ... " + licenseLink.Href);
                }
                return new Promise(async (resolve, reject) => {
                    const failure = (err) => {
                        reject(err);
                    };
                    const success = async (response) => {
                        if (IS_DEV) {
                            Object.keys(response.headers).forEach((header) => {
                                debug(header + " => " + response.headers[header]);
                            });
                        }
                        const tryErrorJson = (str) => {
                            try {
                                const failJson = global.JSON.parse(str);
                                if (IS_DEV) {
                                    debug(failJson);
                                }
                                failJson.httpStatusCode = response.statusCode;
                                failure(failJson);
                            }
                            catch (jsonErr) {
                                if (IS_DEV) {
                                    debug(jsonErr);
                                }
                                failure({ httpStatusCode: response.statusCode, httpResponseBody: str });
                            }
                        };
                        if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
                            let failBuff;
                            try {
                                failBuff = await BufferUtils_1.streamToBufferPromise(response);
                            }
                            catch (buffErr) {
                                if (IS_DEV) {
                                    debug(buffErr);
                                }
                                failure(response.statusCode);
                                return;
                            }
                            try {
                                const failStr = failBuff.toString("utf8");
                                if (IS_DEV) {
                                    debug(failStr);
                                }
                                tryErrorJson(failStr);
                            }
                            catch (strErr) {
                                if (IS_DEV) {
                                    debug(strErr);
                                }
                                failure(response.statusCode);
                            }
                            return;
                        }
                        let responseData;
                        try {
                            responseData = await BufferUtils_1.streamToBufferPromise(response);
                        }
                        catch (err) {
                            reject(err);
                            return;
                        }
                        const lcplStr = responseData.toString("utf8");
                        if (IS_DEV) {
                            debug(lcplStr);
                        }
                        try {
                            const tryLcpJson = global.JSON.parse(lcplStr);
                            if (!tryLcpJson.id || !tryLcpJson.issued || !tryLcpJson.provider || !tryLcpJson.encryption || !tryLcpJson.encryption.profile) {
                                if (IS_DEV) {
                                    debug(lcplStr);
                                    debug("NOT AN LCP LICENSE!");
                                }
                                tryErrorJson(lcplStr);
                                return;
                            }
                        }
                        catch (jsonErr) {
                            if (IS_DEV) {
                                debug(jsonErr);
                            }
                            tryErrorJson(lcplStr);
                            return;
                        }
                        resolve(lcplStr);
                    };
                    const headers = Object.assign({
                        "Accept": "application/json,application/xml",
                        "Accept-Language": "en-UK,en-US;q=0.7,en;q=0.5",
                        "User-Agent": "Readium2-LCP",
                    }, httpHeaders ? httpHeaders : {});
                    follow_redirects_1.http.get(Object.assign(Object.assign({}, new URL(licenseLink.Href)), { headers }))
                        .on("response", success)
                        .on("error", failure);
                });
            }
        }
    }
    return Promise.reject("No LSD LCP update.");
}
exports.lsdLcpUpdate = lsdLcpUpdate;
//# sourceMappingURL=lcpl-update.js.map