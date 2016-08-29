"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var _ = require("underscore");
var FPrice = (function (_super) {
    __extends(FPrice, _super);
    function FPrice(queryFunction, lastCalculate) {
        if (lastCalculate === void 0) { lastCalculate = false; }
        _super.call(this, queryFunction, 'price', lastCalculate);
    }
    FPrice.prototype.extractValue = function (e) {
        if (!e || !e.data)
            return null;
        var sub = e.data.split(' ');
        var currency = null;
        var sl = sub.length;
        var bestValue = null;
        for (var i = 0; i < sl; ++i) {
            var c = this.dict.checkWord(sub[i], false);
            if (c) {
                currency = c;
                var inx = e.data.indexOf(currency);
                var rest = e.data.substr(inx);
                var value = this.regexExtractPrice(rest);
                if (value && value > bestValue) {
                    bestValue = value;
                }
            }
        }
        if (!bestValue)
            return null;
        return { value: bestValue, curr: currency };
    };
    FPrice.prototype.regexExtractPrice = function (s) {
        var match = s.match(/[+\-]?\d+(,\d+)?(\.\d+)?/);
        if (!match)
            return null;
        else {
            return parseFloat(match[0]);
        }
    };
    /* analyzeList (l: Array<DOMObject>): void {
       var self = this;
       _.each(l, function (x) {
         self.analyzeDOMElem(x);
       }.bind(this))
     }*/
    FPrice.prototype.analyzeDOMElem = function (e) {
        var inf = 0;
        if (e.data) {
            var value = this.extractValue(e);
            if (value)
                inf = (value.value.toString().length + value.curr.length) / e.data.length;
        }
        if (value)
            e.price = { value: value.value, currency: value.curr };
        return { information: inf };
    };
    return FPrice;
}(Feature_1.Feature));
exports.FPrice = FPrice;
//# sourceMappingURL=FPrice.js.map