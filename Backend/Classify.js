"use strict";
var FImage_1 = require("./Features/FImage");
var FBrand_1 = require("./Features/FBrand");
var FLink_1 = require("./Features/FLink");
var FPrice_1 = require("./Features/FPrice");
var FTitle_1 = require("./Features/FTitle");
var GC_Grouper_1 = require("./GC_Grouper");
var _ = require("underscore");
var MathUnit = require('./MathUnit.js').MathUnit;
var Classify = (function () {
    function Classify(queryFunction, images) {
        this.featuresToLoad = 0;
        this.featuresLoaded = 0;
        this.allFeaturesLoaded = null;
        this.features = [];
        this.images = images;
        this.queryFunction = queryFunction;
    }
    Classify.prototype.onLoadedFeature = function () {
        this.featuresLoaded++;
        if (this.featuresLoaded == this.featuresToLoad) {
            this.allFeaturesLoaded();
        }
    };
    Classify.prototype.ft = function (name) {
        var ft;
        _.each(this.features, function (el) {
            if (el.dbField == name)
                ft = el;
        });
        return ft;
    };
    Classify.prototype.loadFeatures = function (allLoaded) {
        this.allFeaturesLoaded = allLoaded;
        this.addFeature(new FImage_1.FImage(this.queryFunction));
        this.addFeature(new FBrand_1.FBrand(this.queryFunction));
        this.addFeature(new FLink_1.FLink(this.queryFunction));
        this.addFeature(new FPrice_1.FPrice(this.queryFunction));
        this.addFeature(new FTitle_1.FTitle(this.queryFunction));
        this.addFeature(new FImage_1.FImage(this.queryFunction));
        this.ft('image').images = this.images;
        var self = this;
        _.each(this.features, function (el) {
            el.initDictionary(self.onLoadedFeature.bind(self));
        });
    };
    Classify.prototype.addFeature = function (f) {
        this.featuresToLoad++;
        this.features.push(f);
    };
    Classify.prototype.analyzeList = function (l) {
        console.log('classify::analyzeList');
        // Maybe better pick the Biggest guy of  them all
        var fprice = this.ft('price');
        var fimage = this.ft('image');
        var bestPriceRule = {
            information: 0,
            rule: null,
            elements: null
        };
        var bestImageRule = {
            information: 0,
            rule: null,
            elements: null
        };
        var res = [];
        var standart = MathUnit.maxParam(l, 'maxDepth');
        var ll = l.length;
        GC_Grouper_1.traverse(standart, function analyze(el) {
            //console.log(el.type);
            var rule = standart.grouper.getRule(el, standart, true, false);
            var stack = [];
            //only text
            for (var i = 0; i < ll; ++i) {
                var obj = l[i].grouper.getObjByRule(rule, l[i], false);
                if (obj) {
                    stack.push(obj);
                }
            }
            //console.log(stack);
            var res = fprice.analyzeList(stack);
            console.log(res.information);
            if (res.information > bestPriceRule.information) {
                bestPriceRule.information = res.information;
                bestPriceRule.elements = stack;
                bestPriceRule.rule = rule;
            }
            var res = fimage.analyzeList(stack);
            if (res.information > bestImageRule.information) {
                bestImageRule.information = res.information;
                bestImageRule.elements = stack;
                bestImageRule.rule = rule;
            }
            //ANALYZE STACK
            //get rule of el
        }, false);
        for (var i = 0; i < bestPriceRule.elements.length; ++i) {
            console.log(bestPriceRule.elements[i].price.value);
            console.log(bestImageRule.elements[i].image.value);
        }
        return res;
    };
    Classify.prototype.learn = function (featureName) {
        if (featureName === void 0) { featureName = null; }
    };
    return Classify;
}());
exports.Classify = Classify;
//# sourceMappingURL=Classify.js.map