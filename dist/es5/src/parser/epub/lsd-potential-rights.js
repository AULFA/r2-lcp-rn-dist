"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PotentialRights = void 0;
var tslib_1 = require("tslib");
var ta_json_x_1 = require("ta-json-x");
var PotentialRights = (function () {
    function PotentialRights() {
    }
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("end"),
        tslib_1.__metadata("design:type", Date)
    ], PotentialRights.prototype, "End", void 0);
    PotentialRights = tslib_1.__decorate([
        ta_json_x_1.JsonObject()
    ], PotentialRights);
    return PotentialRights;
}());
exports.PotentialRights = PotentialRights;
//# sourceMappingURL=lsd-potential-rights.js.map