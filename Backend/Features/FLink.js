"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var FLink = (function (_super) {
    __extends(FLink, _super);
    function FLink(queryFunction, lastCalculate) {
        if (lastCalculate === void 0) { lastCalculate = false; }
        _super.call(this, queryFunction, 'link', lastCalculate);
    }
    FLink.prototype.extractValue = function (s) {
        return '';
    };
    FLink.prototype.analyzeDOMElem = function (e) {
        var inf = 0;
        if (e.data) {
            if (e.data.indexOf(this.classify.domain) >= 1)
                inf = 0.5;
            var substr = e.data.split('-');
            for (var i = 0, l = substr.length; i < l; ++i) {
                substr[i];
            }
        }
        return { information: inf };
    };
    return FLink;
}(Feature_1.Feature));
exports.FLink = FLink;
//# sourceMappingURL=FLink.js.map