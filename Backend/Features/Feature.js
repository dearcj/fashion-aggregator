"use strict";
var BTD = require('../BTreeDictionary/BTDictionary');
var _ = require("underscore");
var DOMObject = (function () {
    function DOMObject() {
    }
    return DOMObject;
}());
var ClassifyResults = (function () {
    function ClassifyResults() {
    }
    return ClassifyResults;
}());
exports.ClassifyResults = ClassifyResults;
var Feature = (function () {
    function Feature(queryFunction, dbField) {
        this.qf = queryFunction;
        this.dbField = dbField;
    }
    Feature.prototype.initDictionary = function (cb) {
        var self = this;
        this.dict = new BTD.BTDictionary();
        if (this.dbField)
            this.qf('SELECT * FROM features f where f.name = $1', [this.dbField], function (err, res) {
                if (!err) {
                    if (res[0].dictionary)
                        self.dict.load(res[0].dictionary);
                    cb();
                }
            });
    };
    Feature.prototype.textToStringArray = function (f) {
        f = f.toLowerCase();
        var sub = [];
        var str = f.slice(0);
        sub.push(str);
        while (str != '') {
            var inx = str.indexOf(" ");
            if (~inx) {
                str = str.substr(inx + 1);
            }
            else
                break;
            if (str != '')
                sub.push(str);
        }
        return sub;
    };
    Feature.prototype.fieldDictIntersection = function (field) {
        field = field.toLowerCase();
        //field.split(' ');
        var sub = this.textToStringArray(field);
        //vintage tommy hilfiger garbage
        // 1) as is
        // 2) tommy hilfiger garbage
        // 3) hilfiger garbage
        // 4) garbage
        var maxInf = 0;
        var sl = sub.length;
        for (var i = 0; i < sl; ++i) {
            var obj = this.dict.getIntersectionDepth(sub[i]);
            var inf = (obj.count) / field.length;
            if (!obj.prevStrict)
                inf *= 0.15; //penalty for partial word
            maxInf = inf > maxInf ? inf : maxInf;
        }
        return { information: maxInf, value: '' };
    };
    Feature.prototype.updateDictionary = function () {
        if (this.dbField) {
            var dict = this.dict.save();
            this.qf('UPDATE features SET dictionary = ($1) where name = $2', [dict, this.dbField], function (err, res) {
                if (!err) {
                }
            });
        }
    };
    Feature.prototype.analyzeList = function (l) {
        var i = 0;
        var self = this;
        _.each(l, function (x) {
            i += self.analyzeDOMElem(x).information;
        }.bind(this));
        var avg = i / l.length;
        return { information: avg };
    };
    Feature.prototype.analyzeDOMElem = function (e) {
        return null;
    };
    return Feature;
}());
exports.Feature = Feature;
//# sourceMappingURL=Feature.js.map