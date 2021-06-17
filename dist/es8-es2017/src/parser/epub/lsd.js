"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSD = exports.StatusEnum = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
const lcp_link_1 = require("./lcp-link");
const lsd_event_1 = require("./lsd-event");
const lsd_potential_rights_1 = require("./lsd-potential-rights");
const lsd_updated_1 = require("./lsd-updated");
var StatusEnum;
(function (StatusEnum) {
    StatusEnum["Ready"] = "ready";
    StatusEnum["Active"] = "active";
    StatusEnum["Revoked"] = "revoked";
    StatusEnum["Returned"] = "returned";
    StatusEnum["Cancelled"] = "cancelled";
    StatusEnum["Expired"] = "expired";
})(StatusEnum = exports.StatusEnum || (exports.StatusEnum = {}));
let LSD = class LSD {
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("id"),
    tslib_1.__metadata("design:type", String)
], LSD.prototype, "ID", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("status"),
    tslib_1.__metadata("design:type", String)
], LSD.prototype, "Status", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("message"),
    tslib_1.__metadata("design:type", String)
], LSD.prototype, "Message", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("updated"),
    tslib_1.__metadata("design:type", lsd_updated_1.Updated)
], LSD.prototype, "Updated", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("links"),
    ta_json_x_1.JsonElementType(lcp_link_1.Link),
    tslib_1.__metadata("design:type", Array)
], LSD.prototype, "Links", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("potential_rights"),
    tslib_1.__metadata("design:type", lsd_potential_rights_1.PotentialRights)
], LSD.prototype, "PotentialRights", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("events"),
    ta_json_x_1.JsonElementType(lsd_event_1.LsdEvent),
    tslib_1.__metadata("design:type", Array)
], LSD.prototype, "Events", void 0);
LSD = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], LSD);
exports.LSD = LSD;
//# sourceMappingURL=lsd.js.map