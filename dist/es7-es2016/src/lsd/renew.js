"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lsdRenew_ = exports.lsdRenew = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const follow_redirects_1 = require("follow-redirects");
const BufferUtils_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/stream/BufferUtils");
const lsd_1 = require("../parser/epub/lsd");
const serializable_1 = require("../serializable");
const URI = require("urijs");
const URITemplate = require("urijs/src/URITemplate");
const debug = debug_("r2:lcp#lsd/renew");
const IS_DEV = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev");
function lsdRenew(end, lsdJSON, deviceIDManager, httpHeaders) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (lsdJSON instanceof lsd_1.LSD) {
            return lsdRenew_(end, lsdJSON, deviceIDManager);
        }
        let lsd;
        try {
            lsd = serializable_1.TaJsonDeserialize(lsdJSON, lsd_1.LSD);
        }
        catch (err) {
            debug(err);
            debug(lsdJSON);
            return Promise.reject("Bad LSD JSON?");
        }
        const obj = lsdRenew_(end, lsd, deviceIDManager, httpHeaders);
        return serializable_1.TaJsonSerialize(obj);
    });
}
exports.lsdRenew = lsdRenew;
function lsdRenew_(end, lsd, deviceIDManager, httpHeaders) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!lsd) {
            return Promise.reject("LCP LSD data is missing.");
        }
        if (!lsd.Links) {
            return Promise.reject("No LSD links!");
        }
        const licenseRenew = lsd.Links.find((link) => {
            return link.Rel === "renew";
        });
        if (!licenseRenew) {
            return Promise.reject("No LSD renew link!");
        }
        let deviceID;
        try {
            deviceID = yield deviceIDManager.getDeviceID();
        }
        catch (err) {
            debug(err);
            return Promise.reject("Problem getting Device ID !?");
        }
        let deviceNAME;
        try {
            deviceNAME = yield deviceIDManager.getDeviceNAME();
        }
        catch (err) {
            debug(err);
            return Promise.reject("Problem getting Device NAME !?");
        }
        let renewURL = licenseRenew.Href;
        if (licenseRenew.Templated) {
            const urlTemplate = new URITemplate(renewURL);
            const uri1 = urlTemplate.expand({ end: "xxx", id: deviceID, name: deviceNAME }, { strict: false });
            renewURL = uri1.toString();
            const uri2 = new URI(renewURL);
            uri2.search((data) => {
                data.end = end === null || end === void 0 ? void 0 : end.toISOString();
            });
            renewURL = uri2.toString();
        }
        if (IS_DEV) {
            debug("RENEW: " + renewURL);
        }
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const failure = (err) => {
                reject(err);
            };
            const success = (response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (IS_DEV) {
                    Object.keys(response.headers).forEach((header) => {
                        debug(header + " => " + response.headers[header]);
                    });
                }
                if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
                    let failBuff;
                    try {
                        failBuff = yield BufferUtils_1.streamToBufferPromise(response);
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
                        try {
                            const failJson = global.JSON.parse(failStr);
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
                            failure({ httpStatusCode: response.statusCode, httpResponseBody: failStr });
                        }
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
                    responseData = yield BufferUtils_1.streamToBufferPromise(response);
                }
                catch (err) {
                    reject(err);
                    return;
                }
                const responseStr = responseData.toString("utf8");
                if (IS_DEV) {
                    debug(responseStr);
                }
                const responseJson = global.JSON.parse(responseStr);
                if (IS_DEV) {
                    debug(responseJson);
                }
                try {
                    const newLsd = serializable_1.TaJsonDeserialize(responseJson, lsd_1.LSD);
                    if (IS_DEV) {
                        debug(newLsd);
                    }
                    resolve(newLsd);
                }
                catch (err) {
                    debug(err);
                    resolve(responseJson);
                }
            });
            const headers = Object.assign({
                "Accept": "application/json,application/xml",
                "Accept-Language": "en-UK,en-US;q=0.7,en;q=0.5",
                "User-Agent": "Readium2-LCP",
            }, httpHeaders ? httpHeaders : {});
            follow_redirects_1.http.request(Object.assign(Object.assign({}, new URL(renewURL)), { headers, method: "PUT" }))
                .on("response", success)
                .on("error", failure)
                .end();
        }));
    });
}
exports.lsdRenew_ = lsdRenew_;
//# sourceMappingURL=renew.js.map