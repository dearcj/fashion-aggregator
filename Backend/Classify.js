"use strict";
var FImage_1 = require("./Features/FImage");
var FBrand_1 = require("./Features/FBrand");
var FLink_1 = require("./Features/FLink");
var FPrice_1 = require("./Features/FPrice");
var FTitle_1 = require("./Features/FTitle");
var _ = require("underscore");
var MathUnit = require('./MathUnit.js');
var Classify = (function () {
    function Classify(g, queryFunction) {
        this.grouper = g;
        var f = new FImage_1.FImage(queryFunction);
        this.addFeature(f);
        this.addFeature(new FBrand_1.FBrand(queryFunction));
        this.addFeature(new FLink_1.FLink(queryFunction));
        this.addFeature(new FPrice_1.FPrice(queryFunction));
        this.addFeature(new FTitle_1.FTitle(queryFunction));
        this.addFeature(new FImage_1.FImage(queryFunction));
    }
    Classify.prototype.addFeature = function (f) {
        this.features.push(f);
    };
    Classify.prototype.analyzeList = function (l) {
        // Maybe better pick the Biggest guy of  them all
        var res = [];
        var standart = MathUnit.maxParam(l, 'maxDepth');
        _.each(l, function (el) {
        });
        return res;
    };
    Classify.prototype.learn = function (featureName) {
        if (featureName === void 0) { featureName = null; }
    };
    return Classify;
}());
exports.Classify = Classify;
//# sourceMappingURL=Classify.js.map