"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentKey = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
let ContentKey = class ContentKey {
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("encrypted_value"),
    tslib_1.__metadata("design:type", String)
], ContentKey.prototype, "EncryptedValue", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("algorithm"),
    tslib_1.__metadata("design:type", String)
], ContentKey.prototype, "Algorithm", void 0);
ContentKey = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], ContentKey);
exports.ContentKey = ContentKey;
//# sourceMappingURL=lcp-contentkey.js.map