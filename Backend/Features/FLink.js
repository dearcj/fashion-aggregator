"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var FLink = (function (_super) {
    __extends(FLink, _super);
    function FLink(queryFunction) {
        _super.call(this, queryFunction, 'link');
    }
    return FLink;
}(Feature_1.Feature));
exports.FLink = FLink;
//# sourceMappingURL=FLink.js.map