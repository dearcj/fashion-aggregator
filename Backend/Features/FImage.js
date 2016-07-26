"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var FImage = (function (_super) {
    __extends(FImage, _super);
    function FImage(queryFunction, cb) {
        _super.call(this, queryFunction, 'image', cb);
    }
    return FImage;
}(Feature_1.Feature));
exports.FImage = FImage;
//# sourceMappingURL=FImage.js.map