"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCP = exports.setLcpNativePluginPath = void 0;
const tslib_1 = require("tslib");
const crypto = require("crypto");
const debug_ = require("debug");
const follow_redirects_1 = require("follow-redirects");
const ta_json_x_1 = require("ta-json-x");
const BufferUtils_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/stream/BufferUtils");
const lcp_certificate_1 = require("./lcp-certificate");
const lcp_encryption_1 = require("./lcp-encryption");
const lcp_link_1 = require("./lcp-link");
const lcp_rights_1 = require("./lcp-rights");
const lcp_signature_1 = require("./lcp-signature");
const lcp_user_1 = require("./lcp-user");
const AES_BLOCK_SIZE = 16;
const debug = debug_("r2:lcp#parser/epub/lcp");
const IS_DEV = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev");
function setLcpNativePluginPath(_) {
    return false;
}
exports.setLcpNativePluginPath = setLcpNativePluginPath;
let LCP = class LCP {
    constructor() {
        this._usesNativeNodePlugin = undefined;
    }
    isNativeNodePlugin() {
        this.init();
        return this._usesNativeNodePlugin;
    }
    isReady() {
        if (this.isNativeNodePlugin()) {
            return typeof this._lcpContext !== "undefined";
        }
        return typeof this.ContentKey !== "undefined";
    }
    init() {
        if (typeof this._usesNativeNodePlugin !== "undefined") {
            return;
        }
        this.ContentKey = undefined;
        this._lcpContext = undefined;
        if (IS_DEV) {
            debug("LCP JS impl");
        }
        this._usesNativeNodePlugin = false;
        this._lcpNative = undefined;
    }
    decrypt(encryptedContent, linkHref, needsInflating) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isNativeNodePlugin()) {
                return Promise.reject("direct decrypt buffer only for native plugin");
            }
            if (!this._lcpContext) {
                return Promise.reject("LCP context not initialized (call tryUserKeys())");
            }
            return new Promise((resolve, reject) => {
                this._lcpNative.decrypt(this._lcpContext, encryptedContent, (er, decryptedContent, inflated) => {
                    if (er) {
                        debug("decrypt ERROR");
                        debug(er);
                        reject(er);
                        return;
                    }
                    let buff = decryptedContent;
                    if (!inflated) {
                        const padding = decryptedContent[decryptedContent.length - 1];
                        buff = decryptedContent.slice(0, decryptedContent.length - padding);
                    }
                    resolve({
                        buffer: buff,
                        inflated: inflated ? true : false,
                    });
                }, this.JsonSource, linkHref, needsInflating);
            });
        });
    }
    dummyCreateContext() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.init();
            if (this._usesNativeNodePlugin) {
                const crlPem = yield this.getCRLPem();
                const sha256DummyPassphrase = "0".repeat(64);
                return new Promise((resolve, reject) => {
                    this._lcpNative.createContext(this.JsonSource, sha256DummyPassphrase, crlPem, (erro, _context) => {
                        if (erro) {
                            debug("dummyCreateContext ERROR");
                            debug(erro);
                            reject(erro);
                            return;
                        }
                        resolve();
                    });
                });
            }
            return Promise.resolve();
        });
    }
    tryUserKeys(lcpUserKeys) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.init();
            const check = (this.Encryption.Profile === "http://readium.org/lcp/basic-profile"
                || this.Encryption.Profile === "http://readium.org/lcp/profile-1.0")
                && this.Encryption.UserKey.Algorithm === "http://www.w3.org/2001/04/xmlenc#sha256"
                && this.Encryption.ContentKey.Algorithm === "http://www.w3.org/2001/04/xmlenc#aes256-cbc";
            if (!check) {
                debug("Incorrect LCP fields.");
                debug(this.Encryption.Profile);
                debug(this.Encryption.ContentKey.Algorithm);
                debug(this.Encryption.UserKey.Algorithm);
                return Promise.reject("Incorrect LCP fields.");
            }
            if (this._usesNativeNodePlugin) {
                const crlPem = yield this.getCRLPem();
                return new Promise((resolve, reject) => {
                    this._lcpNative.findOneValidPassphrase(this.JsonSource, lcpUserKeys, (err, validHashedPassphrase) => {
                        if (err) {
                            debug("findOneValidPassphrase ERROR");
                            debug(err);
                            reject(err);
                            return;
                        }
                        this._lcpNative.createContext(this.JsonSource, validHashedPassphrase, crlPem, (erro, context) => {
                            if (erro) {
                                debug("createContext ERROR");
                                debug(erro);
                                reject(erro);
                                return;
                            }
                            this._lcpContext = context;
                            resolve();
                        });
                    });
                });
            }
            for (const lcpUserKey of lcpUserKeys) {
                try {
                    if (this.tryUserKey(lcpUserKey)) {
                        return Promise.resolve();
                    }
                }
                catch (err) {
                }
            }
            return Promise.reject(1);
        });
    }
    getCRLPem() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const crlURL = lcp_certificate_1.CRL_URL;
                const failure = (err) => {
                    debug(err);
                    resolve(lcp_certificate_1.DUMMY_CRL);
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
                    const lcplStr = "-----BEGIN X509 CRL-----\n" +
                        responseData.toString("base64") + "\n-----END X509 CRL-----";
                    if (IS_DEV) {
                        debug(lcplStr);
                    }
                    resolve(lcplStr);
                });
                const headers = {};
                follow_redirects_1.http.get(Object.assign(Object.assign({}, new URL(crlURL)), { headers }))
                    .on("response", success)
                    .on("error", failure);
            }));
        });
    }
    tryUserKey(lcpUserKey) {
        const userKey = Buffer.from(lcpUserKey, "hex");
        const keyCheck = Buffer.from(this.Encryption.UserKey.KeyCheck, "base64");
        const encryptedLicenseID = keyCheck;
        const iv = encryptedLicenseID.slice(0, AES_BLOCK_SIZE);
        const encrypted = encryptedLicenseID.slice(AES_BLOCK_SIZE);
        const decrypteds = [];
        const decryptStream = crypto.createDecipheriv("aes-256-cbc", userKey, iv);
        decryptStream.setAutoPadding(false);
        const buff1 = decryptStream.update(encrypted);
        if (buff1) {
            decrypteds.push(buff1);
        }
        const buff2 = decryptStream.final();
        if (buff2) {
            decrypteds.push(buff2);
        }
        const decrypted = Buffer.concat(decrypteds);
        const nPaddingBytes = decrypted[decrypted.length - 1];
        const size = encrypted.length - nPaddingBytes;
        const decryptedOut = decrypted.slice(0, size).toString("utf8");
        if (this.ID !== decryptedOut) {
            debug("Failed LCP ID check.");
            return false;
        }
        const encryptedContentKey = Buffer.from(this.Encryption.ContentKey.EncryptedValue, "base64");
        const iv2 = encryptedContentKey.slice(0, AES_BLOCK_SIZE);
        const encrypted2 = encryptedContentKey.slice(AES_BLOCK_SIZE);
        const decrypteds2 = [];
        const decryptStream2 = crypto.createDecipheriv("aes-256-cbc", userKey, iv2);
        decryptStream2.setAutoPadding(false);
        const buff1_ = decryptStream2.update(encrypted2);
        if (buff1_) {
            decrypteds2.push(buff1_);
        }
        const buff2_ = decryptStream2.final();
        if (buff2_) {
            decrypteds2.push(buff2_);
        }
        const decrypted2 = Buffer.concat(decrypteds2);
        const nPaddingBytes2 = decrypted2[decrypted2.length - 1];
        const size2 = encrypted2.length - nPaddingBytes2;
        this.ContentKey = decrypted2.slice(0, size2);
        return true;
    }
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("id"),
    tslib_1.__metadata("design:type", String)
], LCP.prototype, "ID", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("provider"),
    tslib_1.__metadata("design:type", String)
], LCP.prototype, "Provider", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("issued"),
    tslib_1.__metadata("design:type", Date)
], LCP.prototype, "Issued", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("updated"),
    tslib_1.__metadata("design:type", Date)
], LCP.prototype, "Updated", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("encryption"),
    tslib_1.__metadata("design:type", lcp_encryption_1.Encryption)
], LCP.prototype, "Encryption", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("rights"),
    tslib_1.__metadata("design:type", lcp_rights_1.Rights)
], LCP.prototype, "Rights", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("user"),
    tslib_1.__metadata("design:type", lcp_user_1.User)
], LCP.prototype, "User", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("signature"),
    tslib_1.__metadata("design:type", lcp_signature_1.Signature)
], LCP.prototype, "Signature", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("links"),
    ta_json_x_1.JsonElementType(lcp_link_1.Link),
    tslib_1.__metadata("design:type", Array)
], LCP.prototype, "Links", void 0);
LCP = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], LCP);
exports.LCP = LCP;
//# sourceMappingURL=lcp.js.map