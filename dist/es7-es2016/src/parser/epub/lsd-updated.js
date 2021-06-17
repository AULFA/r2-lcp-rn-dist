"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updated = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
let Updated = class Updated {
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("license"),
    tslib_1.__metadata("design:type", Date)
], Updated.prototype, "License", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("status"),
    tslib_1.__metadata("design:type", Date)
], Updated.prototype, "Status", void 0);
Updated = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], Updated);
exports.Updated = Updated;
//# sourceMappingURL=lsd-updated.js.map