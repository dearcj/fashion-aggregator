"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var FBrand = (function (_super) {
    __extends(FBrand, _super);
    function FBrand(queryFunction) {
        _super.call(this, queryFunction, 'brand');
    }
    FBrand.prototype.extractValue = function (e) {
        if (!e)
          return null;
      var value = '';
      var s = this.textToStringArray(e.data);
      for (var i = 0, sl = s.length; i < sl; ++i) {
        var x = this.dict.getIntersectionDepth(s[i]);
        if (x.prevStrict && x.count > value.length)
          value = s[i].substr(0, x.count);
      }
      return value;
    };
    FBrand.prototype.analyzeDOMElem = function (e) {
        var obj;
        if (e.data) {
          obj = this.fieldDictIntersection(e.data);
        }
        else
            obj = { information: 0, value: null };
        e[this.dbField] = obj;
        return obj;
    };
    return FBrand;
}(Feature_1.Feature));
exports.FBrand = FBrand;
//# sourceMappingURL=FBrand.js.map
