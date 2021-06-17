"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaJsonSerialize = exports.TaJsonDeserialize = exports.KeyToPreserveUnknownJSON = void 0;
const ta_json_x_1 = require("ta-json-x");
exports.KeyToPreserveUnknownJSON = "AdditionalJSON";
function TaJsonDeserialize(json, type) {
    return ta_json_x_1.JSON.deserialize(json, type, { keyToPreserveUnknownJSON: exports.KeyToPreserveUnknownJSON });
}
exports.TaJsonDeserialize = TaJsonDeserialize;
function TaJsonSerialize(obj) {
    return ta_json_x_1.JSON.serialize(obj, { keyToPreserveUnknownJSON: exports.KeyToPreserveUnknownJSON });
}
exports.TaJsonSerialize = TaJsonSerialize;
//# sourceMappingURL=serializable.js.map