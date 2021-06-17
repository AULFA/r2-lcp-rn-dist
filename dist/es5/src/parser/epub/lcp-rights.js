"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rights = void 0;
var tslib_1 = require("tslib");
var ta_json_x_1 = require("ta-json-x");
var Rights = (function () {
    function Rights() {
    }
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("print"),
        tslib_1.__metadata("design:type", Number)
    ], Rights.prototype, "Print", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("copy"),
        tslib_1.__metadata("design:type", Number)
    ], Rights.prototype, "Copy", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("start"),
        tslib_1.__metadata("design:type", Date)
    ], Rights.prototype, "Start", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("end"),
        tslib_1.__metadata("design:type", Date)
    ], Rights.prototype, "End", void 0);
    Rights = tslib_1.__decorate([
        ta_json_x_1.JsonObject()
    ], Rights);
    return Rights;
}());
exports.Rights = Rights;
//# sourceMappingURL=lcp-rights.js.map