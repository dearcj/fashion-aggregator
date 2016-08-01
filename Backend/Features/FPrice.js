"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var FPrice = (function (_super) {
    __extends(FPrice, _super);
    function FPrice(queryFunction) {
        _super.call(this, queryFunction, 'price');
    }
    FPrice.prototype.extractValue = function (s) {
        var match = s.match(/[+\-]?\d+(,\d+)?(\.\d+)?/);
        if (match.length == 0)
            return null;
        else {
            return parseFloat(match[0]);
        }
    };
    FPrice.prototype.analyzeDOMElem = function (e) {
        var bestValue = -1;
        if (e.data) {
            var sub = e.data.split(' ');
            var currency = null;
            var sl = sub.length;
            for (var i = 0; i < sl; ++i) {
                var c = this.dict.checkWord(sub[i], false);
                if (c) {
                    currency = c;
                    var inx = e.data.indexOf(currency);
                    var rest = e.data.substr(inx);
                    var value = this.extractValue(rest);
                    if (value && value > bestValue) {
                        bestValue = value;
                        console.log(bestValue);
                    }
                }
            }
        }
    };
    return FPrice;
}(Feature_1.Feature));
exports.FPrice = FPrice;
//# sourceMappingURL=FPrice.js.map