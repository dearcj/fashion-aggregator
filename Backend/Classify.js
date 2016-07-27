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
    function Classify(queryFunction) {
        this.featuresToLoad = 0;
        this.featuresLoaded = 0;
        this.allFeaturesLoaded = null;
        this.features = [];
        this.queryFunction = queryFunction;
    }
    Classify.prototype.onLoadedFeature = function () {
        this.featuresLoaded++;
        if (this.featuresLoaded == this.featuresToLoad) {
            this.allFeaturesLoaded();
        }
    };
    Classify.prototype.loadFeatures = function (allLoaded) {
        this.allFeaturesLoaded = allLoaded;
        this.addFeature(new FImage_1.FImage(this.queryFunction, this.onLoadedFeature.bind(this)));
        this.addFeature(new FBrand_1.FBrand(this.queryFunction, this.onLoadedFeature.bind(this)));
        this.addFeature(new FLink_1.FLink(this.queryFunction, this.onLoadedFeature.bind(this)));
        this.addFeature(new FPrice_1.FPrice(this.queryFunction, this.onLoadedFeature.bind(this)));
        this.addFeature(new FTitle_1.FTitle(this.queryFunction, this.onLoadedFeature.bind(this)));
        this.addFeature(new FImage_1.FImage(this.queryFunction, this.onLoadedFeature.bind(this)));
    };
    Classify.prototype.addFeature = function (f) {
        this.featuresToLoad++;
        this.features.push(f);
    };
    Classify.prototype.analyzeList = function (l) {
        // Maybe better pick the Biggest guy of  them all
        var res = [];
        var standart = MathUnit.maxParam(l, 'maxDepth');
        var ll = l.length;
        GC_Grouper_1.traverse(standart, function analyze(el) {
            var rule = standart.grouper.getRule(el, standart, true);
            var stack = [];
            //only text
            for (var i = 0; i < ll; ++i) {
                var obj = l[i].grouper.getObjByRule(rule, l[i]);
                if (obj) {
                    stack.push(obj);
                }
            }
            console.log(stack);
            //ANALYZE STACK
            //get rule of el
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