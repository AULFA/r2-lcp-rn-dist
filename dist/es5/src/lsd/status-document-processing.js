"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchStatusDocumentProcessing = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var follow_redirects_1 = require("follow-redirects");
var BufferUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/BufferUtils");
var lsd_1 = require("../parser/epub/lsd");
var serializable_1 = require("../serializable");
var lcpl_update_1 = require("./lcpl-update");
var register_1 = require("./register");
var debug = debug_("r2:lcp#lsd/status-document-processing");
var IS_DEV = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev");
function launchStatusDocumentProcessing(lcp, deviceIDManager, onStatusDocumentProcessingComplete, httpHeaders) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var linkStatus, failure, success, headers;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            if (!lcp || !lcp.Links) {
                if (onStatusDocumentProcessingComplete) {
                    onStatusDocumentProcessingComplete(undefined);
                }
                return [2];
            }
            linkStatus = lcp.Links.find(function (link) {
                return link.Rel === "status";
            });
            if (!linkStatus) {
                if (onStatusDocumentProcessingComplete) {
                    onStatusDocumentProcessingComplete(undefined);
                }
                return [2];
            }
            if (IS_DEV) {
                debug(linkStatus);
            }
            failure = function (err) {
                debug(err);
                if (onStatusDocumentProcessingComplete) {
                    onStatusDocumentProcessingComplete(undefined);
                }
            };
            success = function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var failBuff, buffErr_1, failStr, failJson, responseData, err_1, responseStr, mime, lsdJSON, licenseUpdateResponseJson, err_2, registerResponse, err_3;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (IS_DEV) {
                                Object.keys(response.headers).forEach(function (header) {
                                    debug(header + " => " + response.headers[header]);
                                });
                            }
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
                                try {
                                    failJson = global.JSON.parse(failStr);
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
                            return [2];
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            return [4, BufferUtils_1.streamToBufferPromise(response)];
                        case 6:
                            responseData = _a.sent();
                            return [3, 8];
                        case 7:
                            err_1 = _a.sent();
                            debug(err_1);
                            if (onStatusDocumentProcessingComplete) {
                                onStatusDocumentProcessingComplete(undefined);
                            }
                            return [2];
                        case 8:
                            responseStr = responseData.toString("utf8");
                            mime = "application/vnd.readium.license.status.v1.0+json";
                            if (IS_DEV) {
                                if (response.headers["content-type"] === mime ||
                                    response.headers["content-type"] === "application/json") {
                                    debug(responseStr);
                                }
                            }
                            lsdJSON = global.JSON.parse(responseStr);
                            if (IS_DEV) {
                                debug(lsdJSON);
                            }
                            try {
                                lcp.LSD = serializable_1.TaJsonDeserialize(lsdJSON, lsd_1.LSD);
                                if (IS_DEV) {
                                    debug(lcp.LSD);
                                }
                            }
                            catch (err) {
                                debug(err);
                                if (onStatusDocumentProcessingComplete) {
                                    onStatusDocumentProcessingComplete(undefined);
                                }
                                return [2];
                            }
                            _a.label = 9;
                        case 9:
                            _a.trys.push([9, 11, , 12]);
                            return [4, lcpl_update_1.lsdLcpUpdate(lcp, httpHeaders)];
                        case 10:
                            licenseUpdateResponseJson = _a.sent();
                            return [3, 12];
                        case 11:
                            err_2 = _a.sent();
                            debug(err_2);
                            return [3, 12];
                        case 12:
                            if (licenseUpdateResponseJson) {
                                if (onStatusDocumentProcessingComplete) {
                                    onStatusDocumentProcessingComplete(licenseUpdateResponseJson);
                                }
                                return [2];
                            }
                            if (lcp.LSD.Status === lsd_1.StatusEnum.Revoked
                                || lcp.LSD.Status === lsd_1.StatusEnum.Returned
                                || lcp.LSD.Status === lsd_1.StatusEnum.Cancelled
                                || lcp.LSD.Status === lsd_1.StatusEnum.Expired) {
                                debug("What?! LSD status:" + lcp.LSD.Status);
                                if (onStatusDocumentProcessingComplete) {
                                    onStatusDocumentProcessingComplete(undefined);
                                }
                                return [2];
                            }
                            _a.label = 13;
                        case 13:
                            _a.trys.push([13, 15, , 16]);
                            return [4, register_1.lsdRegister_(lcp.LSD, deviceIDManager, httpHeaders)];
                        case 14:
                            registerResponse = _a.sent();
                            return [3, 16];
                        case 15:
                            err_3 = _a.sent();
                            debug(err_3);
                            return [3, 16];
                        case 16:
                            if (registerResponse) {
                                lcp.LSD = registerResponse;
                                if (IS_DEV) {
                                    debug(lcp.LSD);
                                }
                            }
                            if (onStatusDocumentProcessingComplete) {
                                onStatusDocumentProcessingComplete(undefined);
                            }
                            return [2];
                    }
                });
            }); };
            headers = Object.assign({
                "Accept": "application/json,application/xml",
                "Accept-Language": "en-UK,en-US;q=0.7,en;q=0.5",
                "User-Agent": "Readium2-LCP",
            }, httpHeaders ? httpHeaders : {});
            follow_redirects_1.http.get(tslib_1.__assign(tslib_1.__assign({}, new URL(linkStatus.Href)), { headers: headers }))
                .on("response", success)
                .on("error", failure);
            return [2];
        });
    });
}
exports.launchStatusDocumentProcessing = launchStatusDocumentProcessing;
//# sourceMappingURL=status-document-processing.js.map