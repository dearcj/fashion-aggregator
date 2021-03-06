"use strict";

declare function require(name:string):any;
var _ = require("underscore");
var u = require('./MathUnit.js').MathUnit;
var https = require('https');
var http = require('http');
var imagesize = require('imagesize');
var async = require('async');
var url = require('url');

export class ImgObj {
  url:string;
  domObject:DOMObject;
  width:number;
  height:number;
}


export class DOMObject {
  /*
   Don't use this fields in childrenElem. Logic overwritten in childrenElem
   */
  data:string;
  type:string;
  price:any;
  image:any;
  title: any;

  next:DOMObject;
  prev:DOMObject;
  depth:number;
  maxDepth:number;
  childrenElem:Array<DOMObject>;
  nextElem:DOMObject;
  prevElem:DOMObject;

  parent:DOMObject;
  name:string;
  children:Array<DOMObject>;
  attribs:Array<string>;

  ruleHead:string;
  head:DOMObject;
  rule:string;
  grouper:GcGrouper;
}

class GcConsts {
  NULL_ELEMENT_NEGATIVE:number = -1000;
  MAX_HEAVY_COMPARSION:number = 3;
  COMPARSION_THRESHOLD:number = 50;
}

export function traverse(o:DOMObject, func:Function, onlyElements:boolean = true):void {
  var arr = o.childrenElem;
  if (!onlyElements) {
    arr = o.children;
  }
  if (!arr) return;
  var count = arr.length;
  for (var i = 0; i < count; ++i) {
    if (arr[i]) {
      func.call(this, arr[i], i);

      if (arr[i])
      traverse(arr[i], func);
    }
  }
}

export class GcGrouper extends GcConsts {
  heavyAttribs:Array<string> = ['style', 'class'];
  $; //cheerio jquery Object
  body:DOMObject;
  linkp:string;
  images:Array<ImgObj>;

  constructor($, body:DOMObject, linkp) {
    super();
    this.body = body;
    this.$ = $;
    this.linkp = linkp;
  }

  //call function func for every tree node
  static getImagesFromObj(o:DOMObject):Array<string> {
    var a = [];
    var imagesRegexp = new RegExp('(https?:\/\/.*\.(?:png|jpg|jpeg))', 'i');
    for (var prop in o.attribs) {
      if (imagesRegexp.test(o.attribs[prop])) {
        a.push(o.attribs[prop]);
      }
    }

    return a;
  }

  collectSameOnThisLevel(pair:Array<DOMObject>):Array<DOMObject> {
    var lev = pair[0].depth;
    var sameLev:Array<DOMObject> = [];

    traverse(this.body, function (elem:DOMObject, inx:number) {
      if (elem.depth == lev) {
        if (this.t2tSuperposition(pair[0], elem) > this.COMPARSION_THRESHOLD) {
          sameLev.push(elem);
        }
      }
    }.bind(this));

    return sameLev;
  }

  getObjByRule(rule:string, head:DOMObject, noText:boolean = true):DOMObject {
    if (!head) head = this.body;

    var childArr = 'children';
    if (noText) childArr = 'childrenElem';

    var ruleArr = rule.split('>');
    if (ruleArr.length == 0) return null;
    var baseElem:DOMObject;
    var startInx:number = 0;
    if (ruleArr[0].charAt(0) == '#') {
      baseElem = this.$(ruleArr[0])[0];
      if (!baseElem) return null;
      startInx = 1;
    } else {
      baseElem = head;
    }

    var cnt = ruleArr.length;
    for (var i = startInx; i < cnt; ++i) {
      var inx:number = parseInt(ruleArr[i]);

      if (!baseElem[childArr] || baseElem[childArr].length <= inx) return null;
      baseElem = baseElem[childArr][ruleArr[i]];
    }
    return baseElem;
  }

  getListByRules(head:string, rulesList:Array<string>):Array<DOMObject> {
    var headObj = this.getObjByRule(head, this.body);
    if (!headObj) return null;

    var objList:Array<DOMObject> = [];
    var cnt = rulesList.length;
    for (var i = 0; i < cnt; ++i) {
      var obj = this.getObjByRule(rulesList[i], headObj);
      if (!obj) return null; else
        objList.push(obj);
    }

    return objList;
  }

  /*
   finds dom rule from object <head> to obj <object>
   */
  getRule(object:DOMObject, head:DOMObject, onlyRelative, noText:boolean = true):string {
    var p = object;
    var rootId:string;
    var ruleArr:Array<string> = [];
    if (!head) head = this.body;
    while (p != head) {
      if (!onlyRelative && p.attribs && p.attribs['id']) {
        rootId = p.attribs['id'];
        var xid:string = "#" + rootId;
        ruleArr.unshift(xid);
        break;
      } else {
        //push here inx
        if (noText) var inx = p.parent.childrenElem.indexOf(p); else
          var inx = p.parent.children.indexOf(p);

        ruleArr.unshift(inx.toString());
        //ruleArr.push();
        object = p;
        p = p.parent;
      }
    }

    return ruleArr.join('>');
  }

  getCommonHead(list:Array<DOMObject>):DOMObject {
    var list2:Array<DOMObject> = list.slice();
    while (list2.length != 1) {
      var list3:Array<DOMObject> = [];
      for (var i = 0; i < list2.length; ++i) {
        if (list3.indexOf(list2[i].parent) < 0) {
          list3.push(list2[i].parent);
        }
      }
      list2 = list3;
    }
    return list2[0];
  }

  static isVisible(domo): boolean {
      var s = domo.attribs['style'];
    if (s)
      s = s.replace(/ /g, "");

    if (s && (s.indexOf('visibility:hidden') >= 0 || s.indexOf('display:none') >= 0 ))
      return false;

      if (domo && domo.parent) {
        return GcGrouper.isVisible(domo.parent);
      }

    return true;
  }

  findModel(resCB:Function) {
    this.findImages(function (res:Array<ImgObj>) {
      this.images = res;
      if (res.length == 0) {
        resCB(null);
        return;
      }

      //use only visible images
      var x = _.filter(res, function (el) {
        return GcGrouper.isVisible(el.domObject);// (el.domObject.attribs['style'].indexOf('visibility: hidden') < 0)
      }.bind(this));
      
      var self = this;
      if (res.length == 0) {
        resCB(null);
        return;
      }

      var img = x[0].domObject;

      var par = img.parent;
      while (par && par != this.body) {

        //console.log(this.isList(par.parent));
        if (par.nextElem) {
          var comp = this.t2tSuperposition(par, par.nextElem);
          console.log(comp);
          if (comp > this.COMPARSION_THRESHOLD) {
            var list:Array<DOMObject> = this.collectSameOnThisLevel([par, par.nextElem]);

            var head:DOMObject = this.getCommonHead(list);
            var rulesList:Array<string> = [];
            var ruleHead = this.getRule(head);
            _.each(list, function (y, i) {
              y.head = head;
              y.ruleHead = ruleHead;
              y.grouper = self;
              y.rule = self.getRule(y, head, true);
            });

            resCB(list);
            //OK Possible a list here
          }
        }
        par = par.parent;
      }
      resCB(null);
    }.bind(this));
  }

  fastImageSize(url:string, cb:Function) {
    u.GET(url, cb, function (req, response) {
      imagesize(response, function (err, result) {
        cb(result);
        req.abort();
      });
    });
  }

  collectAllImages(list:Array<any>):Array<any> {
    if (!list) list = [];
    var _this = this;

    if (this.body.children) {
      traverse(this.body, function (el) {
        if (el.name == 'img') {
          var imgs = GcGrouper.getImagesFromObj(el);
          for (var i = 0, il = imgs.length; i < il; ++i)
            list.push({el: el, linkToImage: imgs[i]});
        }
      });
    }

    //Ok. all images collected lets check img resolution
    return list;
  }

  findImages(endCB:Function) {
    var MIN_IMG_WIDTH = 200;
    var MIN_IMG_HEIGHT = 100;

    var imgs = this.collectAllImages(null);
    var results = [];
    var _this = this;
    var funcs = [];
    var baseLinkObj = url.parse(this.linkp);
    var baseLink = baseLinkObj.protocol + '//' + baseLinkObj.host;

    _.each(imgs, function (x) {
      var u = x.linkToImage;
      var p = url.parse(u);
      if (!p.protocol) {
        u = baseLink + u;
      }

      funcs.push(function (callback) {
        _this.fastImageSize(u, function end(res) {
          if (res) {
            res.domObject = x.el;
            res.url = u;
            results.push(res);
          }
          callback();
        })
      })

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
  }

  t2tSuperposition(tree1:DOMObject, tree2:DOMObject, depth:number) {
    if (!depth) depth = 0;
    var value = 0;
    //lets get away from np full task
    //for each children lets assume that one of children is missed, so lets check children comparsion as Max(A[i], B[i], B[i - 1], B[i + 1])
    var headsComparsion = this.el2elComparsion(tree1, tree2);
    if (headsComparsion < 0) return headsComparsion; else
      value = headsComparsion;
    if (!tree1.children || !tree2.children) return 0;
    for (var i = 0; i < tree1.children.length; ++i) {
      var a = tree1.children[i];
      if (tree2.children.length < i) break;
      var b = tree2.children[i];
      var bNext, bPrev;
      if (i >= 1) bPrev = tree2.children[i - 1];
      if (i < tree2.children.length - 1) bNext = tree2.children[i + 1];

      var argmaxParams = [b];
      if (bPrev) argmaxParams.push(bPrev);
      if (bNext) argmaxParams.push(bNext);

      var argmax = u.argmax(this.el2elComparsion.bind(this, a),
        argmaxParams
      );

      var depthCoef = Math.pow(1.2, 1 + depth);
      if (argmax.value > 0) {
        var res = this.t2tSuperposition(a, argmax.arg, depth + 1);
        if (res > 0)
          value += res * depthCoef; else value -= depthCoef;
      } else value -= depthCoef;
    }

    return value;
  }

  arrArrSuperposition(arr1:Array<string>, arr2:Array<string>) {
    var sp = 0;
    _.map(arr1, function (arr1Val) {
      if (arr2.indexOf(arr1Val)) sp++;
    });
    return sp;
  }

  heavyAttribComparsion(attrib1:string, attrib2:string) {
    if (attrib1 == attrib2) return this.MAX_HEAVY_COMPARSION;

    var subAttrArray1 = attrib1.split(" ");
    var subAttrArray2 = attrib2.split(" ");
    var superpositionLev = this.arrArrSuperposition(subAttrArray1, subAttrArray2);

    return (superpositionLev / Math.max(subAttrArray1.length, subAttrArray2.length)) * this.MAX_HEAVY_COMPARSION;
  }

  el2elComparsion(el1:DOMObject, el2:DOMObject) {
    if (!el1 || !el2) return this.NULL_ELEMENT_NEGATIVE;
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
        } else {
          if (el1.attribs[key] == el2.attribs[key]) {
            comparsionLevel++;
          } else
            comparsionLevel--;
        }
      });
    } else
      comparsionLevel = -5;

    return comparsionLevel;
  }


  static updateTextField(t:string):string {
    t = t.replace(/\s\s+/g, ' ');//tabs and multiple spaces to space
    t = t.replace(/(\r\n|\n|\r)/gm, ""); //remove enters, breaklines
    t = t.replace(/(\n\t|\n|\t)/gm, ""); //same
    t = t.replace(/\u00a0/g, ""); //same

    t = t.trim();
    return t;
  }

  collectTextBelow(elem: DOMObject, depth: number) {
    if (depth < 0) return '';
    if (!elem.data) elem.data = '';
    var str = '';
    if (elem.children) {
      var chl = elem.children.length;
      for (var i = 0; i < chl; ++i) {
        str += this.collectTextBelow(elem.children[i], depth - 1);
      }
    }
    return elem.data + str;
  }

  /*
   Add depth and maxdepth info to every element
   */
  updateInfoTree(body:DOMObject = null) {
    if (!body) body = this.body;
    if (!body.depth) body.depth = 0;
    if (!body.maxDepth) body.maxDepth = 0;
    var _this = this;
    var maxDepth = 0;

    var maxChildgroup:number = 6;

    if (body.children) {
      body.childrenElem = [];

      _.each(body.children, function (elem) {
        if (elem.children) {
          if (!elem.data) elem.data = '';
          if (elem.children && elem.type != 'text') {
            elem.data = _this.collectTextBelow(elem, 2);
          }
          elem.data = GcGrouper.updateTextField(elem.data);
          body.childrenElem.push(elem);
          if (body.childrenElem.length > 1) {
            elem.prevElem = body.childrenElem[body.childrenElem.length - 2];
            body.childrenElem[body.childrenElem.length - 2].nextElem = elem;
          }

        }
        elem.depth = body.depth + 1;
        _this.updateInfoTree(elem);
        if (elem.maxDepth > maxDepth) maxDepth = elem.maxDepth;
      });


    }

    body.maxDepth += maxDepth + 1;
  }
}

