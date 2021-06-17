"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserKey = void 0;
var tslib_1 = require("tslib");
var ta_json_x_1 = require("ta-json-x");
var UserKey = (function () {
    function UserKey() {
    }
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("text_hint"),
        tslib_1.__metadata("design:type", String)
    ], UserKey.prototype, "TextHint", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("algorithm"),
        tslib_1.__metadata("design:type", String)
    ], UserKey.prototype, "Algorithm", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("key_check"),
        tslib_1.__metadata("design:type", String)
    ], UserKey.prototype, "KeyCheck", void 0);
    UserKey = tslib_1.__decorate([
        ta_json_x_1.JsonObject()
    ], UserKey);
    return UserKey;
}());
exports.UserKey = UserKey;
//# sourceMappingURL=lcp-userkey.js.map