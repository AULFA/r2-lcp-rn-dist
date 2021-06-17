"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encrypted = void 0;
var tslib_1 = require("tslib");
var ta_json_x_1 = require("ta-json-x");
var Encrypted = (function () {
    function Encrypted() {
        this.DecryptedLengthBeforeInflate = -1;
        this.CypherBlockPadding = -1;
    }
    Object.defineProperty(Encrypted.prototype, "OriginalLength", {
        get: function () {
            return typeof this.OriginalLength2 !== "undefined" ? this.OriginalLength2 : this.OriginalLength1;
        },
        set: function (length) {
            if (typeof length !== "undefined") {
                this.OriginalLength1 = undefined;
                this.OriginalLength2 = length;
            }
        },
        enumerable: false,
        configurable: true
    });
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("scheme"),
        tslib_1.__metadata("design:type", String)
    ], Encrypted.prototype, "Scheme", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("profile"),
        tslib_1.__metadata("design:type", String)
    ], Encrypted.prototype, "Profile", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("algorithm"),
        tslib_1.__metadata("design:type", String)
    ], Encrypted.prototype, "Algorithm", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("compression"),
        tslib_1.__metadata("design:type", String)
    ], Encrypted.prototype, "Compression", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("originalLength"),
        tslib_1.__metadata("design:type", Number)
    ], Encrypted.prototype, "OriginalLength2", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("original-length"),
        tslib_1.__metadata("design:type", Object)
    ], Encrypted.prototype, "OriginalLength1", void 0);
    Encrypted = tslib_1.__decorate([
        ta_json_x_1.JsonObject()
    ], Encrypted);
    return Encrypted;
}());
exports.Encrypted = Encrypted;
//# sourceMappingURL=metadata-encrypted.js.map