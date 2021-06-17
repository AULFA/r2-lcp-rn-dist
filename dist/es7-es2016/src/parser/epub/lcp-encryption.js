"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
const lcp_contentkey_1 = require("./lcp-contentkey");
const lcp_userkey_1 = require("./lcp-userkey");
let Encryption = class Encryption {
};
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
exports.Encryption = Encryption;
//# sourceMappingURL=lcp-encryption.js.map