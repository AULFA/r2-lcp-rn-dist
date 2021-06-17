"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var tslib_1 = require("tslib");
var ta_json_x_1 = require("ta-json-x");
var User = (function () {
    function User() {
    }
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("id"),
        tslib_1.__metadata("design:type", String)
    ], User.prototype, "ID", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("email"),
        tslib_1.__metadata("design:type", String)
    ], User.prototype, "Email", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("name"),
        tslib_1.__metadata("design:type", String)
    ], User.prototype, "Name", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("encrypted"),
        ta_json_x_1.JsonElementType(String),
        tslib_1.__metadata("design:type", Array)
    ], User.prototype, "Encrypted", void 0);
    User = tslib_1.__decorate([
        ta_json_x_1.JsonObject()
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=lcp-user.js.map