/**
 * Created by mac-pc on 7/1/16.
 */
"use strict";
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _ = require("underscore");
var MathUnit = require('./MathUnit.js');
var u = new MathUnit.MathUnit();
var DOMObject = (function () {
    function DOMObject() {
    }
    return DOMObject;
})();
var gc_consts = (function () {
    function gc_consts() {
        this.NULL_ELEMENT_NEGATIVE = -1000;
        this.MAX_HEAVY_COMPARSION = 3;
    }
    return gc_consts;
})();
var gc_grouper = (function (_super) {
    __extends(gc_grouper, _super);
    function gc_grouper() {
        _super.apply(this, arguments);
        this.heavyAttribs = ['style', 'class'];
    }
    gc_grouper.prototype.findAModel = function () {
    };
    gc_grouper.prototype.collectAllImages = function (body, list, d) {
        if (!list)
            var list = new Array();
        var _this = this;
        if (body.children) {
            _.each(body.children, function (el, i) {
                if (el.name == 'img')
                    list.push(el);
                if (el == body)
                    return;
                if (el.children)
                    _this.collectAllImages(el, list, d + 1);
            });
        }
        //Ok. all images collected lets check img resolution
        return list;
    };
    gc_grouper.prototype.t2tSuperposition = function (tree1, tree2, depth) {
        if (!depth)
            depth = 0;
        var value = 0;
        //lets get away from np full task
        //for each children lets assume that one of children is missed, so lets check children comparsion as Max(A[i], B[i], B[i - 1], B[i + 1])
        var headsComparsion = this.el2elComparsion(tree1, tree2);
        if (headsComparsion < 0)
            return headsComparsion;
        else
            value = headsComparsion;
        if (!tree1.children || !tree2.children)
            return 0;
        for (var i = 0; i < tree1.children.length; ++i) {
            var a = tree1.children[i];
            if (tree2.children.length < i)
                break;
            var b = tree2.children[i];
            var bNext, bPrev;
            if (i >= 1)
                bPrev = tree2.children[i - 1];
            if (i < tree2.children.length - 1)
                bNext = tree2.children[i + 1];
            var argmaxParams = [b];
            if (bPrev)
                argmaxParams.push(bPrev);
            if (bNext)
                argmaxParams.push(bNext);
            var argmax = u.argmax(this.el2elComparsion.bind(this, a), argmaxParams);
            var depthCoef = Math.pow(1.2, 1 + depth);
            if (argmax.value > 0) {
                var res = this.t2tSuperposition(a, argmax.arg, depth + 1);
                if (res > 0)
                    value += res * depthCoef;
                else
                    value -= 1 * depthCoef;
            }
            else
                value -= 1 * depthCoef;
            console.log(value);
        }
        return value;
    };
    gc_grouper.prototype.arrArrSuperposition = function (arr1, arr2) {
        var sp = 0;
        _.map(arr1, function (arr1Val) {
            if (arr2.indexOf(arr1Val))
                sp++;
        });
        return sp;
    };
    gc_grouper.prototype.heavyAttribComparsion = function (attrib1, attrib2) {
        if (attrib1 == attrib2)
            return this.MAX_HEAVY_COMPARSION;
        var subAttrArray1 = attrib1.split(" ");
        var subAttrArray2 = attrib2.split(" ");
        var superpositionLev = this.arrArrSuperposition(subAttrArray1, subAttrArray2);
        return (superpositionLev / Math.max(subAttrArray1.length, subAttrArray2.length)) * this.MAX_HEAVY_COMPARSION;
    };
    gc_grouper.prototype.el2elComparsion = function (el1, el2) {
        if (!el1 || !el2)
            return this.NULL_ELEMENT_NEGATIVE;
        var comparsionLevel = 0;
        var _this = this;
        if (el1.name == el2.name) {
            comparsionLevel += 1;
            _.each(el1.attribs, function (num, key) {
                if (!el2.attribs[key]) {
                    comparsionLevel--;
                    return;
                }
                if (!el1.attribs[key] || !el2.attribs[key]) {
                    comparsionLevel--;
                    return;
                }
                if (_this.heavyAttribs.indexOf(key.toLowerCase())) {
                    comparsionLevel += _this.heavyAttribComparsion(el1.attribs[key], el2.attribs[key]);
                }
                else {
                    if (el1.attribs[key] == el2.attribs[key]) {
                        comparsionLevel++;
                    }
                    else
                        comparsionLevel--;
                }
            });
        }
        else
            comparsionLevel = -5;
        return comparsionLevel;
    };
    gc_grouper.prototype.updateInfoTree = function (body) {
        if (!body.depth)
            body.depth = 0;
        if (!body.maxDepth)
            body.maxDepth = 0;
        var _this = this;
        var maxDepth = 0;
        if (body.children)
            _.each(body.children, function (elem) {
                elem.depth = body.depth + 1;
                _this.updateInfoTree(elem);
                if (elem.maxDepth > maxDepth)
                    maxDepth = elem.maxDepth;
            });
        body.maxDepth += maxDepth + 1;
    };
    return gc_grouper;
})(gc_consts);
exports.gc_grouper = gc_grouper;
//# sourceMappingURL=GC_Grouper.js.map