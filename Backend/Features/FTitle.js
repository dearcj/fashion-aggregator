"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var FTitle = (function (_super) {
    __extends(FTitle, _super);
    function FTitle(queryFunction, lastCalculate) {
        if (lastCalculate === void 0) { lastCalculate = false; }
        _super.call(this, queryFunction, 'title', lastCalculate);
    }
    FTitle.prototype.extractValue = function (e) {
        //brand substraction
        if (e && e.data)
            return e.data;
        return '';
    };
    FTitle.prototype.analyzeDOMElem = function (e) {
        var obj;
        var fcat = this.classify.ft('category');
        var fbrand = this.classify.ft('category');
        if (e.data) {
            obj = fcat.fieldDictIntersection(this.extractValue(e));
            obj.containFeature = 'category';
        }
        else
            obj = { information: 0, value: null };
        e[this.dbField] = obj;
        return obj;
    };
    return FTitle;
}(Feature_1.Feature));
exports.FTitle = FTitle;
//# sourceMappingURL=FTitle.js.map