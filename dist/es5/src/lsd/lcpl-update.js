"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lsdLcpUpdate = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var moment = require("moment");
var follow_redirects_1 = require("follow-redirects");
var BufferUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/BufferUtils");
var debug = debug_("r2:lcp#lsd/lcpl-update");
var IS_DEV = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev");
function lsdLcpUpdate(lcp, httpHeaders) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var updatedLicenseLSD, updatedLicense, forceUpdate, licenseLink_1;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            if (!lcp.LSD) {
                return [2, Promise.reject("LCP LSD data is missing.")];
            }
            if (lcp.LSD.Updated && lcp.LSD.Updated.License &&
                (lcp.Updated || lcp.Issued)) {
                updatedLicenseLSD = moment(lcp.LSD.Updated.License);
                updatedLicense = moment(lcp.Updated || lcp.Issued);
                forceUpdate = false;
                if (forceUpdate ||
                    (updatedLicense.isBefore(updatedLicenseLSD))) {
                    if (IS_DEV) {
                        debug("LSD license updating...");
                    }
                    if (lcp.LSD.Links) {
                        licenseLink_1 = lcp.LSD.Links.find(function (link) {
                            return link.Rel === "license";
                        });
                        if (!licenseLink_1) {
                            return [2, Promise.reject("LSD license link is missing.")];
                        }
                        if (IS_DEV) {
                            debug("OLD LCP LICENSE, FETCHING LSD UPDATE ... " + licenseLink_1.Href);
                        }
                        return [2, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var failure, success, headers;
                                var _this = this;
                                return tslib_1.__generator(this, function (_a) {
                                    failure = function (err) {
                                        reject(err);
                                    };
                                    success = function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var tryErrorJson, failBuff, buffErr_1, failStr, responseData, err_1, lcplStr, tryLcpJson;
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (IS_DEV) {
                                                        Object.keys(response.headers).forEach(function (header) {
                                                            debug(header + " => " + response.headers[header]);
                                                        });
                                                    }
                                                    tryErrorJson = function (str) {
                                                        try {
                                                            var failJson = global.JSON.parse(str);
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
                                                    if (!(response.statusCode && (response.statusCode < 200 || response.statusCode >= 300))) return [3, 5];
                                                    failBuff = void 0;
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, , 4]);
                                                    return [4, BufferUtils_1.streamToBufferPromise(response)];
                                                case 2:
                                                    failBuff = _a.sent();
                                                    return [3, 4];
                                                case 3:
                                                    buffErr_1 = _a.sent();
                                                    if (IS_DEV) {
                                                        debug(buffErr_1);
                                                    }
                                                    failure(response.statusCode);
                                                    return [2];
                                                case 4:
                                                    try {
                                                        failStr = failBuff.toString("utf8");
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
                                                    return [2];
                                                case 5:
                                                    _a.trys.push([5, 7, , 8]);
                                                    return [4, BufferUtils_1.streamToBufferPromise(response)];
                                                case 6:
                                                    responseData = _a.sent();
                                                    return [3, 8];
                                                case 7:
                                                    err_1 = _a.sent();
                                                    reject(err_1);
                                                    return [2];
                                                case 8:
                                                    lcplStr = responseData.toString("utf8");
                                                    if (IS_DEV) {
                                                        debug(lcplStr);
                                                    }
                                                    try {
                                                        tryLcpJson = global.JSON.parse(lcplStr);
                                                        if (!tryLcpJson.id || !tryLcpJson.issued || !tryLcpJson.provider || !tryLcpJson.encryption || !tryLcpJson.encryption.profile) {
                                                            if (IS_DEV) {
                                                                debug(lcplStr);
                                                                debug("NOT AN LCP LICENSE!");
                                                            }
                                                            tryErrorJson(lcplStr);
                                                            return [2];
                                                        }
                                                    }
                                                    catch (jsonErr) {
                                                        if (IS_DEV) {
                                                            debug(jsonErr);
                                                        }
                                                        tryErrorJson(lcplStr);
                                                        return [2];
                                                    }
                                                    resolve(lcplStr);
                                                    return [2];
                                            }
                                        });
                                    }); };
                                    headers = Object.assign({
                                        "Accept": "application/json,application/xml",
                                        "Accept-Language": "en-UK,en-US;q=0.7,en;q=0.5",
                                        "User-Agent": "Readium2-LCP",
                                    }, httpHeaders ? httpHeaders : {});
                                    follow_redirects_1.http.get(tslib_1.__assign(tslib_1.__assign({}, new URL(licenseLink_1.Href)), { headers: headers }))
                                        .on("response", success)
                                        .on("error", failure);
                                    return [2];
                                });
                            }); })];
                    }
                }
            }
            return [2, Promise.reject("No LSD LCP update.")];
        });
    });
}
exports.lsdLcpUpdate = lsdLcpUpdate;
//# sourceMappingURL=lcpl-update.js.map