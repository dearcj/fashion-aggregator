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
    FLink.prototype.extractValue = function (e) {
      var link;
      link = e.attribs['href'];
      if (link.indexOf('://') < 0) {
        link = this.classify.domain + link;
      }
      return link;
    };
    FLink.prototype.analyzeDOMElem = function (e) {
        var inf = 0;
        var fcat = this.classify.ft('category');
        var fbrand = this.classify.ft('brand');
        var ftitle = this.classify.ft('title');
        if (e.name == 'a' && e.attribs['href']) {
            var possibleLink = e.attribs['href'];
            if (possibleLink.indexOf(this.classify.domain) >= 1)
                inf = 0.5;
            var substr = e.attribs['href'].split('-');
            for (var i = 0, l = substr.length; i < l; ++i) {
                var objCat = fcat.fieldDictIntersection(substr[i]);
                var objBrand = fbrand.fieldDictIntersection(substr[i]);
                var objTitle = ftitle.fieldDictIntersection(substr[i]);
                inf += Math.max(objCat.information, objBrand.information, objTitle.information);
            }
            inf /= substr.length;
        }
        return { information: inf };
    };
    return FLink;
}(Feature_1.Feature));
exports.FLink = FLink;
//# sourceMappingURL=FLink.js.map
