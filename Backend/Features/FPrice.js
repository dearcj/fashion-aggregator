"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var FPrice = (function (_super) {
    __extends(FPrice, _super);
    function FPrice(queryFunction, cb) {
        _super.call(this, queryFunction, 'price', cb);
    }
    return FPrice;
}(Feature_1.Feature));
exports.FPrice = FPrice;
//# sourceMappingURL=FPrice.js.map