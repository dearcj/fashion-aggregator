"use strict";
var FImage_1 = require("./Features/FImage");
var FBrand_1 = require("./Features/FBrand");
var FLink_1 = require("./Features/FLink");
var FPrice_1 = require("./Features/FPrice");
var FCategory_1 = require("./Features/FCategory");
var FTitle_1 = require("./Features/FTitle");
var GC_Grouper_1 = require("./GC_Grouper");
var History_1 = require("./History");
var crypto = require("crypto");
var curr = require("./Utils/Currencies.js");
var u = require('./MathUnit.js').MathUnit;
var request = require('requestretry');
var buffer = require('buffer');
var hasha = require('hasha');
var url = require('url');
var _ = require("underscore");
var MathUnit = require('./MathUnit.js').MathUnit;
var Classify = (function () {
    function Classify(queryFunction, images, link) {
        this.featuresToLoad = 0;
        this.featuresLoaded = 0;
        this.allFeaturesLoaded = null;
        this.features = [];
        var baseLinkObj = url.parse(link);
        this.domain = baseLinkObj.protocol + '//' + baseLinkObj.host;
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
        this.addFeature(new FLink_1.FLink(this.queryFunction, true));
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
        _.each(this.features, function (feature) {
            if (feature.lastCalculate)
                return;
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
                var res = feature.analyzeList(stack);
                if (res.information > feature.classifyResult.information) {
                    feature.classifyResult = {
                        information: res.information,
                        density: res.density,
                        elements: stack,
                        rule: rule
                    };
                }
            }.bind(this), false);
        }.bind(this));
        var objs = [];
        for (var i = 0; i < ll; ++i) {
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
                l[feature.dbField] = value;
                l['inf-' + feature.dbField] = feature.classifyResult.information;
                l['den-' + feature.dbField] = feature.classifyResult.information;
            });
        }
        _.each(l, function (el) {
            console.log(l['inf-link'], l['den-link'], l['link']);
        });
        this.loadFullImages(objs, function () {
            _.each(objs, function (obj) {
                this.saveItem(obj);
                if (obj.title)
                    this.learnFeature('title', obj.title);
                if (obj.brand)
                    this.learnFeature('brand', obj.brand);
            }.bind(this));
        }.bind(this));
        return res;
    };
    Classify.generateHash = function (o, imageBuffer) {
        var imHash = o.image ? hasha(imageBuffer) : '';
        var str = [o.title, o.brand, imHash].join('_');
        return crypto.createHash('md5').update(str).digest('hex');
    };
    Classify.prototype.loadFullImages = function (arr, cb) {
        u.async(function (object, cb) {
            if (!object.image) {
                cb(null);
                return;
            }
            request({
                uri: object.image.value,
                maxAttempts: 5,
                retryDelay: 5000,
                retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
                encoding: null
            }, function (error, response, body) {
                object.image_data = body;
                cb(body);
            });
        }, arr, function superdone(allResults) {
            cb(allResults);
        });
    };
    Classify.prototype.isUnique = function (hash, cb) {
        this.queryFunction('select count(*) from items where hash = $1', [hash], function (err, res) {
            if (res[0].count == 0)
                cb(true);
            else
                cb(false);
        });
    };
    Classify.prototype.saveItem = function (obj) {
        obj.hash = Classify.generateHash(obj, obj.image_data);
        if (obj.price)
            var priceCurrCode = curr.getCurrency(obj.price.curr);
        if (obj.image_data) {
        }
        this.isUnique(obj.hash, function (res) {
            var params = [obj.hash,
                new Date(),
                obj.price ? obj.price.value : null,
                obj.price ? priceCurrCode : null,
                obj.category,
                obj.image ? obj.image.value : null,
                obj.image_data];
            if (res) {
                this.queryFunction('INSERT INTO items ' +
                    '(hash, create_date, price, price_currency, category, image_link, image_data) VALUES ($1, $2, $3, $4, $5, $6, $7)', params, function (err, res) {
                    console;
                });
            }
            else {
                this.queryFunction('UPDATE items set ' +
                    'update_date = $2, ' +
                    'price = $3, ' +
                    'price_currency = $4, ' +
                    'category = $5, ' +
                    'image_link = $6, ' +
                    'image_data = $7 ' +
                    'where hash = $1 ', params, function (err, res) {
                    console;
                });
            }
        }.bind(this));
    };
    return Classify;
}());
exports.Classify = Classify;
//# sourceMappingURL=Classify.js.map