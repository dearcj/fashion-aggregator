import {GcGrouper} from "./GC_Grouper";
import {Feature} from "./Features/Feature";
import {FImage} from "./Features/FImage";
import {FBrand} from "./Features/FBrand";
import {FLink} from "./Features/FLink";
import {FPrice} from "./Features/FPrice";
import {FTitle} from "./Features/FTitle";
import {DOMObject} from "./GC_Grouper";
import {traverse} from "./GC_Grouper";

declare function require(name:string):any;
var _ = require("underscore");
var MathUnit = require('./MathUnit.js').MathUnit;

export class Classify {
  featuresToLoad:number = 0;
  featuresLoaded:number = 0;
  allFeaturesLoaded:Function = null;
  queryFunction:(q:string, params:Array<Object>) => void;
  images: Array<any>;
  grouper:GcGrouper;
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

    this.addFeature(new FImage(this.queryFunction));
    this.addFeature(new FBrand(this.queryFunction));
    // this.addFeature(new FLink(this.queryFunction));
    this.addFeature(new FPrice(this.queryFunction));
    // this.addFeature(new FTitle(this.queryFunction));
    //  this.addFeature(new FImage(this.queryFunction));
    this.ft('image').images = this.images;

    var self = this;
    _.each(this.features, function (el) {
      el.initDictionary(self.onLoadedFeature.bind(self));
    });
  }

  constructor(queryFunction:(q:string, params:Array<Object>) => void, images: Array<any>) {
    this.images = images;
    this.queryFunction = queryFunction;
  }

  addFeature(f:Feature) {
    this.featuresToLoad++;
    this.features.push(f);
  }

  analyzeList(l:Array<DOMObject>) {
    console.log('classify::analyzeList');
    // Maybe better pick the Biggest guy of  them all



    _.each(this.features, function (el) {
      el.classifyResult = {
        information: 0,
        rule: null,
        elements: null
      }
    });

    var res = [];
    var standart:DOMObject = MathUnit.maxParam(l, 'maxDepth');
    var ll = l.length;

    traverse(standart, function analyze(el) {
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
      _.each(this.features, function (feature) {
        var res = feature.analyzeList(stack);
        if (res.information > feature.classifyResult.information)
          feature.classifyResult = {
            information: res.information,
            elements: stack,
            rule: rule
          }
      });

      //ANALYZE STACK

      //get rule of el
    }.bind(this), false);


    var len = this.features[0].classifyResult.elements.length;

    for (var i:number = 0; i < len; ++i) {
      _.each(this.features, function (feature) {
          console.log(feature.classifyResult.elements[i]);
        console.log(feature.classifyResult.elements[i][feature.dbField].value);
      });
    }


    return res;
  }

  learn(featureName:string = null) {

  }

}
