"use strict";
var BTD = require('../BTreeDictionary/BTDictionary');
var DOMObject = (function () {
    function DOMObject() {
    }
    return DOMObject;
}());
var Feature = (function () {
    function Feature(queryFunction, dbField, cb) {
        this.qf = queryFunction;
        this.dbField = dbField;
        this.initDictionary(dbField, cb);
    }
    Feature.prototype.initDictionary = function (dbField, cb) {
        var self = this;
        this.dbField = dbField;
        this.dict = new BTD.BTDictionary();
        if (this.dbField)
            this.qf('SELECT * FROM features f where f.name = $1', [this.dbField], function (err, res) {
                if (!err) {
                    if (res[0].dictionary)
                        self.dict = res[0].dictionary;
                    cb();
                }
            });
    };
    Feature.prototype.analyzeDOMElem = function (e) {
    };
    return Feature;
}());
exports.Feature = Feature;
//# sourceMappingURL=Feature.js.map