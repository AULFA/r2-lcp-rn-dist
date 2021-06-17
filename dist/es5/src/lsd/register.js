"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lsdRegister_ = exports.lsdRegister = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var follow_redirects_1 = require("follow-redirects");
var BufferUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/BufferUtils");
var lsd_1 = require("../parser/epub/lsd");
var serializable_1 = require("../serializable");
var URITemplate = require("urijs/src/URITemplate");
var debug = debug_("r2:lcp#lsd/register");
var IS_DEV = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev");
function lsdRegister(lsdJSON, deviceIDManager, httpHeaders) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var lsd, obj;
        return tslib_1.__generator(this, function (_a) {
            if (lsdJSON instanceof lsd_1.LSD) {
                return [2, lsdRegister_(lsdJSON, deviceIDManager)];
            }
            try {
                lsd = serializable_1.TaJsonDeserialize(lsdJSON, lsd_1.LSD);
            }
            catch (err) {
                debug(err);
                debug(lsdJSON);
                return [2, Promise.reject("Bad LSD JSON?")];
            }
            obj = lsdRegister_(lsd, deviceIDManager, httpHeaders);
            return [2, serializable_1.TaJsonSerialize(obj)];
        });
    });
}
exports.lsdRegister = lsdRegister;
function lsdRegister_(lsd, deviceIDManager, httpHeaders) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var licenseRegister, deviceID, err_1, deviceNAME, err_2, doRegister, deviceIDForStatusDoc, err_3, registerURL, urlTemplate, uri1;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!lsd) {
                        return [2, Promise.reject("LCP LSD data is missing.")];
                    }
                    if (!lsd.Links) {
                        return [2, Promise.reject("No LSD links!")];
                    }
                    licenseRegister = lsd.Links.find(function (link) {
                        return link.Rel === "register";
                    });
                    if (!licenseRegister) {
                        return [2, Promise.reject("No LSD register link!")];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, deviceIDManager.getDeviceID()];
                case 2:
                    deviceID = _a.sent();
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    debug(err_1);
                    return [2, Promise.reject("Problem getting Device ID !?")];
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4, deviceIDManager.getDeviceNAME()];
                case 5:
                    deviceNAME = _a.sent();
                    return [3, 7];
                case 6:
                    err_2 = _a.sent();
                    debug(err_2);
                    return [2, Promise.reject("Problem getting Device NAME !?")];
                case 7:
                    doRegister = false;
                    if (!(lsd.Status === lsd_1.StatusEnum.Ready)) return [3, 8];
                    doRegister = true;
                    return [3, 13];
                case 8:
                    if (!(lsd.Status === lsd_1.StatusEnum.Active)) return [3, 13];
                    deviceIDForStatusDoc = void 0;
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4, deviceIDManager.checkDeviceID(lsd.ID)];
                case 10:
                    deviceIDForStatusDoc = _a.sent();
                    return [3, 12];
                case 11:
                    err_3 = _a.sent();
                    debug(err_3);
                    return [3, 12];
                case 12:
                    if (!deviceIDForStatusDoc) {
                        doRegister = true;
                    }
                    else if (deviceIDForStatusDoc !== deviceID) {
                        if (IS_DEV) {
                            debug("LSD registered device ID is different? ", lsd.ID, ": ", deviceIDForStatusDoc, " --- ", deviceID);
                        }
                        doRegister = true;
                    }
                    _a.label = 13;
                case 13:
                    if (!doRegister) {
                        return [2, Promise.reject("No need to LSD register.")];
                    }
                    registerURL = licenseRegister.Href;
                    if (licenseRegister.Templated) {
                        urlTemplate = new URITemplate(registerURL);
                        uri1 = urlTemplate.expand({ id: deviceID, name: deviceNAME }, { strict: true });
                        registerURL = uri1.toString();
                    }
                    if (IS_DEV) {
                        debug("REGISTER: " + registerURL);
                    }
                    return [2, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var failure, success, headers;
                            var _this = this;
                            return tslib_1.__generator(this, function (_a) {
                                failure = function (err) {
                                    reject(err);
                                };
                                success = function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var failBuff, buffErr_1, failStr, failJson, responseData, err_4, responseStr, responseJson, err_5, newLsd;
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
                                                err_4 = _a.sent();
                                                reject(err_4);
                                                return [2];
                                            case 8:
                                                responseStr = responseData.toString("utf8");
                                                if (IS_DEV) {
                                                    debug(responseStr);
                                                }
                                                responseJson = global.JSON.parse(responseStr);
                                                if (IS_DEV) {
                                                    debug(responseJson);
                                                    debug(responseJson.status);
                                                }
                                                if (!(responseJson.status === "active")) return [3, 12];
                                                _a.label = 9;
                                            case 9:
                                                _a.trys.push([9, 11, , 12]);
                                                return [4, deviceIDManager.recordDeviceID(responseJson.id)];
                                            case 10:
                                                _a.sent();
                                                return [3, 12];
                                            case 11:
                                                err_5 = _a.sent();
                                                debug(err_5);
                                                return [3, 12];
                                            case 12:
                                                try {
                                                    newLsd = serializable_1.TaJsonDeserialize(responseJson, lsd_1.LSD);
                                                    if (IS_DEV) {
                                                        debug(newLsd);
                                                    }
                                                    resolve(newLsd);
                                                }
                                                catch (err) {
                                                    debug(err);
                                                    resolve(responseJson);
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
                                follow_redirects_1.http.request(tslib_1.__assign(tslib_1.__assign({}, new URL(registerURL)), { headers: headers, method: "POST" }))
                                    .on("response", success)
                                    .on("error", failure)
                                    .end();
                                return [2];
                            });
                        }); })];
            }
        });
    });
}
exports.lsdRegister_ = lsdRegister_;
//# sourceMappingURL=register.js.map