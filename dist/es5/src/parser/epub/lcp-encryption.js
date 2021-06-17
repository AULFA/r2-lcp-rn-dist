"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
var tslib_1 = require("tslib");
var ta_json_x_1 = require("ta-json-x");
var lcp_contentkey_1 = require("./lcp-contentkey");
var lcp_userkey_1 = require("./lcp-userkey");
var Encryption = (function () {
    function Encryption() {
    }
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("profile"),
        tslib_1.__metadata("design:type", String)
    ], Encryption.prototype, "Profile", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("content_key"),
        tslib_1.__metadata("design:type", lcp_contentkey_1.ContentKey)
    ], Encryption.prototype, "ContentKey", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("user_key"),
        tslib_1.__metadata("design:type", lcp_userkey_1.UserKey)
    ], Encryption.prototype, "UserKey", void 0);
    Encryption = tslib_1.__decorate([
        ta_json_x_1.JsonObject()
    ], Encryption);
    return Encryption;
}());
exports.Encryption = Encryption;
//# sourceMappingURL=lcp-encryption.js.map