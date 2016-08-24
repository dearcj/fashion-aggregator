"use strict";
var FImage_1 = require("./Features/FImage");
var FBrand_1 = require("./Features/FBrand");
var FPrice_1 = require("./Features/FPrice");
var FCategory_1 = require("./Features/FCategory");
var FTitle_1 = require("./Features/FTitle");
var GC_Grouper_1 = require("./GC_Grouper");
var History_1 = require("./History");
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
        this.history = new History_1.History(queryFunction);
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
        this.addFeature(new FBrand_1.FBrand(this.queryFunction));
        this.addFeature(new FPrice_1.FPrice(this.queryFunction));
        this.addFeature(new FTitle_1.FTitle(this.queryFunction));
        this.addFeature(new FCategory_1.FCategory(this.queryFunction));
        this.addFeature(new FImage_1.FImage(this.queryFunction));
        this.ft('image').images = this.images;
        var self = this;
        _.each(this.features, function (el) {
            el.initDictionary(self.onLoadedFeature.bind(self));
        });
    };
    Classify.prototype.addFeature = function (f) {
        f.classify = this;
        this.featuresToLoad++;
        this.features.push(f);
    };
    Classify.prototype.revertHistory = function (hid) {
        this.history.select(hid, function (err, r) {
            var history = r[0];
            if (history.action == 'learn') {
                var f = this.ft(history.location);
                f.dict.removeWord(history.value);
                f.updateDictionary();
                this.history.remove(hid);
            }
        }.bind(this));
    };
    Classify.prototype.learnFeature = function (fname, value) {
        this.ft(fname).dict.addWord(value);
        this.ft(fname).updateDictionary();
        console.log(fname + ' learned: ' + value);
        this.history.track('learn', fname, value);
    };
    Classify.prototype.analyzeList = function (l) {
        console.log('classify::analyzeList');
        // Maybe better pick the Biggest guy of  them all
        _.each(this.features, function (el) {
            el.classifyResult = {
                information: 0,
                density: 0,
                rule: null,
                elements: null
            };
        });
        var res = [];
        var standart = MathUnit.maxParam(l, 'maxDepth');
        var ll = l.length;
        GC_Grouper_1.traverse(standart, function analyze(el) {
            var rule = standart.grouper.getRule(el, standart, true, false);
            console.log(rule);
            var stack = [];
            //only text
            for (var i = 0; i < ll; ++i) {
                var obj = l[i].grouper.getObjByRule(rule, l[i], false);
                if (obj) {
                    stack.push(obj);
                }
            }
            //console.log(stack);
            _.each(this.features, function (feature) {
                var res = feature.analyzeList(stack);
                if (res.information > feature.classifyResult.information)
                    feature.classifyResult = {
                        information: res.information,
                        density: res.density,
                        elements: stack,
                        rule: rule
                    };
            });
            //ANALYZE STACK
            //get rule of el
        }.bind(this), false);
        var objs = [];
        for (var i = 0; i < ll; ++i) {
            var trackedObj = {};
            _.each(this.features, function (feature) {
                console.log(feature.dbField, ' inf = ' + feature.classifyResult.information, ' den =' + feature.classifyResult.density);
                if (feature.classifyResult.density > 0.95) {
                    var getAll = true;
                }
                else
                    getAll = false;
                var r = feature.classifyResult.rule;
                if (r) {
                    var obj = l[i].grouper.getObjByRule(r, l[i], false);
                    var value = feature.extractValue(obj, getAll);
                }
                else {
                    value = null;
                }
                trackedObj[feature.dbField] = value;
                trackedObj['inf-' + feature.dbField] = feature.classifyResult.information;
                trackedObj['den-' + feature.dbField] = feature.classifyResult.information;
            });
            objs.push(trackedObj);
            console.log(JSON.stringify(trackedObj));
        }
        _.each(objs, function (obj) {
            this.saveAndLearn(obj);
            if (!obj.title || !obj.brand) {
                console;
            }
            if (obj.title)
                this.learnFeature('title', obj.title);
            if (obj.brand)
                this.learnFeature('brand', obj.brand);
        }.bind(this));
        console.log(objs.length);
        return res;
    };
    Classify.prototype.saveAndLearn = function (obj) {
    };
    return Classify;
}());
exports.Classify = Classify;
//# sourceMappingURL=Classify.js.map