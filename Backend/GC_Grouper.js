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
var https = require('https');
var http = require('http');
var imagesize = require('imagesize');
var async = require('async');
var ImgObj = (function () {
    function ImgObj() {
    }
    return ImgObj;
})();
var DOMObject = (function () {
    function DOMObject() {
    }
    return DOMObject;
})();
var GcConsts = (function () {
    function GcConsts() {
        this.NULL_ELEMENT_NEGATIVE = -1000;
        this.MAX_HEAVY_COMPARSION = 3;
    }
    return GcConsts;
})();
var GcGrouper = (function (_super) {
    __extends(GcGrouper, _super);
    function GcGrouper($) {
        _super.call(this);
        this.heavyAttribs = ['style', 'class'];
        this.$ = $;
    }
    GcGrouper.prototype.getObjByRule = function (rule, body) {
        var ruleArr = rule.split('>');
        if (ruleArr.length == 0)
            return null;
        var baseElem;
        var startInx = 0;
        if (ruleArr[0].charAt(0) == '#') {
            baseElem = this.$(ruleArr[0])[0];
            if (!baseElem)
                return null;
            startInx = 1;
        }
        else {
            baseElem = body;
        }
        var cnt = ruleArr.length;
        for (var i = startInx; i < cnt; ++i) {
            var inx = parseInt(ruleArr[i]);
            if (baseElem.childrenElem.length <= inx)
                return null;
            baseElem = baseElem.childrenElem[ruleArr[i]];
        }
        return baseElem;
    };
    GcGrouper.prototype.getRule = function (object, body) {
        var p = object;
        var rootId;
        var ruleArr = [];
        while (p != body) {
            if (p.attribs['id']) {
                rootId = p.attribs['id'];
                var xid = "#" + rootId;
                ruleArr.unshift(xid);
                break;
            }
            else {
                //push here inx
                var inx = p.parent.childrenElem.indexOf(p);
                ruleArr.unshift(inx.toString());
                //ruleArr.push();
                object = p;
                p = p.parent;
            }
        }
        return ruleArr.join('>');
    };
    GcGrouper.prototype.findModel = function (body) {
        const imageComparsionThresh = 500;
        this.findImages(body, function (res) {
            var img = res[0].domObject;
            var par = img.parent;
            while (par && par != body) {
                //console.log(this.isList(par.parent));
                if (par.nextElem) {
                    var comp = this.t2tSuperposition(par, par.nextElem);
                    if (comp > imageComparsionThresh) {
                        console.log(par);
                    }
                    console.log(comp);
                }
                par = par.parent;
            }
        }.bind(this));
    };
    GcGrouper.prototype.fastImageSize = function (url, cb) {
        var protocol = null;
        if (url.indexOf('https:') == 0)
            protocol = https;
        if (url.indexOf('http:') == 0)
            protocol = http;
        url = encodeURI(url);
        if (protocol) {
            var request = protocol.get(url, function (response) {
                imagesize(response, function (err, result) {
                    cb(result, result);
                    request.abort();
                });
            });
        }
        else
            cb(false);
    };
    GcGrouper.prototype.collectAllImages = function (body, list, d) {
        if (!list)
            list = [];
        var _this = this;
        var funcs = [];
        async.parallel(funcs);
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
    GcGrouper.prototype.findImages = function (body, endCB) {
        var MIN_IMG_WIDTH = 200;
        var MIN_IMG_HEIGHT = 100;
        var imgs = this.collectAllImages(body[0], null, null);
        var results = [];
        var _this = this;
        var funcs = [];
        _.each(imgs, function (x) {
            funcs.push(function (callback) {
                _this.fastImageSize(x.attribs['src'], function end(res) {
                    if (res) {
                        res.domObject = x;
                        res.url = x.attribs['src'];
                        results.push(res);
                    }
                    callback();
                });
            });
        });
        async.parallel(funcs, function done() {
            for (var i = 0; i < results.length; ++i) {
                if (!results[i] || results[i].width < MIN_IMG_WIDTH || results[i].height < MIN_IMG_HEIGHT) {
                    results.splice(i, 1);
                    i--;
                }
            }
            endCB(results);
        });
    };
    GcGrouper.prototype.t2tSuperposition = function (tree1, tree2, depth) {
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
                    value -= depthCoef;
            }
            else
                value -= depthCoef;
        }
        return value;
    };
    GcGrouper.prototype.arrArrSuperposition = function (arr1, arr2) {
        var sp = 0;
        _.map(arr1, function (arr1Val) {
            if (arr2.indexOf(arr1Val))
                sp++;
        });
        return sp;
    };
    GcGrouper.prototype.heavyAttribComparsion = function (attrib1, attrib2) {
        if (attrib1 == attrib2)
            return this.MAX_HEAVY_COMPARSION;
        var subAttrArray1 = attrib1.split(" ");
        var subAttrArray2 = attrib2.split(" ");
        var superpositionLev = this.arrArrSuperposition(subAttrArray1, subAttrArray2);
        return (superpositionLev / Math.max(subAttrArray1.length, subAttrArray2.length)) * this.MAX_HEAVY_COMPARSION;
    };
    GcGrouper.prototype.el2elComparsion = function (el1, el2) {
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
    /*
    Add depth and maxdepth info to every element
     */
    GcGrouper.prototype.updateInfoTree = function (body) {
        if (!body.depth)
            body.depth = 0;
        if (!body.maxDepth)
            body.maxDepth = 0;
        var _this = this;
        var maxDepth = 0;
        if (body.children) {
            body.childrenElem = [];
            _.each(body.children, function (elem) {
                if (elem.name) {
                    body.childrenElem.push(elem);
                    if (body.childrenElem.length > 1) {
                        elem.prevElem = body.childrenElem[body.childrenElem.length - 2];
                        body.childrenElem[body.childrenElem.length - 2].nextElem = elem;
                    }
                }
                elem.depth = body.depth + 1;
                _this.updateInfoTree(elem);
                if (elem.maxDepth > maxDepth)
                    maxDepth = elem.maxDepth;
            });
        }
        body.maxDepth += maxDepth + 1;
    };
    return GcGrouper;
})(GcConsts);
exports.GcGrouper = GcGrouper;
//# sourceMappingURL=GC_Grouper.js.map