import {GcGrouper} from "./GC_Grouper";
import {Feature} from "./Features/Feature";
import {FImage} from "./Features/FImage";
import {FBrand} from "./Features/FBrand";
import {FLink} from "./Features/FLink";
import {FPrice} from "./Features/FPrice";
import {FCategory} from "./Features/FCategory";
import {FTitle} from "./Features/FTitle";
import {DOMObject} from "./GC_Grouper";
import {traverse} from "./GC_Grouper";
import {History} from "./History";

declare function require(name:string):any;
declare var Buffer:any;

var crypto = require("crypto");
var curr = require("./Utils/Currencies.js");
var u = require('./MathUnit.js').MathUnit;
var request = require('requestretry');
var buffer = require('buffer');
var hasha = require('hasha');
var url = require('url');

var _ = require("underscore");
var MathUnit = require('./MathUnit.js').MathUnit;

export class Classify {
  featuresToLoad:number = 0;
  featuresLoaded:number = 0;
  allFeaturesLoaded: Function = null;
  queryFunction: (q:string, params:Array<Object>, cv:Function) => void;
  images: Array<any>;
  grouper: GcGrouper;
  history: History;
  domain: string;
  private features:Array<Feature> = [];

  onLoadedFeature() {
    this.featuresLoaded++;
    if (this.featuresLoaded == this.featuresToLoad) {
      this.allFeaturesLoaded();
    }
  }

  ft(name: string): Feature {
    var ft: Feature;
    _.each(this.features, function (el) {
      if (el.dbField == name) ft = el;
    });
    return ft;
  }

  loadFeatures(allLoaded:Function) {
    this.allFeaturesLoaded = allLoaded;

    this.addFeature(new FBrand(this.queryFunction));
    this.addFeature(new FPrice(this.queryFunction));
    this.addFeature(new FTitle(this.queryFunction));
    this.addFeature(new FCategory(this.queryFunction));
    this.addFeature(new FImage(this.queryFunction));
    this.addFeature(new FLink(this.queryFunction, true));
    this.ft('image').images = this.images;

    var self = this;
    _.each(this.features, function (el) {
      el.initDictionary(self.onLoadedFeature.bind(self));
    });
  }

  constructor(queryFunction:(q:string, params:Array<Object>) => void, images: Array<any>, link: string) {
    var baseLinkObj = url.parse(link);

    this.domain =  baseLinkObj.protocol + '//' + baseLinkObj.host;
    this.images = images;
    this.queryFunction = queryFunction;
    this.history = new History(queryFunction);
  }

  addFeature(f:Feature) {
    f.classify = this;
    this.featuresToLoad++;
    this.features.push(f);
  }

  revertHistory(hid:number):void {
    this.history.select(hid, function (err, r) {
      var history = r[0];
      if (history.action == 'learn') {
        var f = this.ft(history.location);
        f.dict.removeWord(history.value);
        f.updateDictionary();
        this.history.remove(hid);
      }
    }.bind(this));
  }

  learnFeature(fname:string, value:string):void {
    this.ft(fname).dict.addWord(value);
    this.ft(fname).updateDictionary();
    console.log(fname + ' learned: ' + value);
    this.history.track('learn', fname, value);
  }

  analyzeList(l:Array<DOMObject>) {
    console.log('classify::analyzeList');
    // Maybe better pick the Biggest guy of  them all

    _.each(this.features, function (el) {
      el.classifyResult = {
        information: 0,
        density: 0,
        rule: null,
        elements: null
      }
    });

    var res = [];
    var standart:DOMObject = MathUnit.maxParam(l, 'maxDepth');
    var ll = l.length;

    _.each(this.features, function (feature) {
      if (feature.lastCalculate) return;

      traverse(standart, function analyze(el) {
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
        if (feature.lastCalculate) return;

        console.log(feature.dbField, ' inf = ' + feature.classifyResult.information, ' den =' + feature.classifyResult.density);

        if (feature.classifyResult.density > 0.95) {
          var getAll = true;
        } else getAll = false;

        var r = feature.classifyResult.rule;

        if (r) {
          var obj = l[i].grouper.getObjByRule(r, l[i], false);

          var value = feature.extractValue(obj, getAll);
        } else {
          value = null;
        }

        l[feature.dbField] = value;
        l['inf-' + feature.dbField] = feature.classifyResult.information;
        l['den-' + feature.dbField] = feature.classifyResult.information;
      });


      console.log(JSON.stringify(l));
    }

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
  }

  static generateHash(o:any, imageBuffer:any):void {
    var imHash = o.image ? hasha(imageBuffer) : '';
    var str = [o.title, o.brand, imHash].join('_');

    return crypto.createHash('md5').update(str).digest('hex');
  }


  loadFullImages(arr:Array<any>, cb):void {

    u.async(function (object, cb) {
      if (!object.image) {
        cb(null);
        return;
      }
      request({
        uri: object.image.value,
        maxAttempts: 5,   // (default) try 5 times
        retryDelay: 5000,  // (default) wait for 5s before trying again
        retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
        encoding: null
      }, function (error, response, body) {
        object.image_data = body;
        cb(body);
      });

    }, arr, function superdone(allResults) {
      cb(allResults);
    });

  }

  isUnique(hash:string, cb:Function):void {
    this.queryFunction('select count(*) from items where hash = $1',
      [hash], function (err, res) {
        if (res[0].count == 0) cb(true); else cb(false);
      });
  }

  saveItem(obj:any):void {
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
          '(hash, create_date, price, price_currency, category, image_link, image_data) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          params, function (err, res) {
            console;
          });

      } else {
        this.queryFunction('UPDATE items set ' +
          'update_date = $2, ' +
          'price = $3, ' +
          'price_currency = $4, ' +
          'category = $5, ' +
          'image_link = $6, ' +
          'image_data = $7 ' +
          'where hash = $1 ',
          params, function (err, res) {
            console;
          });
      }

    }.bind(this));


  }

}
