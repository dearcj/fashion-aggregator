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

  grouper:GcGrouper;
  private features:Array<Feature> = [];

  onLoadedFeature() {
    this.featuresLoaded++;
    if (this.featuresLoaded == this.featuresToLoad) {
      this.allFeaturesLoaded();
    }
  }

  loadFeatures(allLoaded:Function) {
    this.allFeaturesLoaded = allLoaded;

    this.addFeature(new FImage(this.queryFunction, this.onLoadedFeature.bind(this)));
    this.addFeature(new FBrand(this.queryFunction, this.onLoadedFeature.bind(this)));
    this.addFeature(new FLink(this.queryFunction, this.onLoadedFeature.bind(this)));
    this.addFeature(new FPrice(this.queryFunction, this.onLoadedFeature.bind(this)));
    this.addFeature(new FTitle(this.queryFunction, this.onLoadedFeature.bind(this)));
    this.addFeature(new FImage(this.queryFunction, this.onLoadedFeature.bind(this)));
  }

  constructor(queryFunction:(q:string, params:Array<Object>) => void) {
    this.queryFunction = queryFunction;
  }

  addFeature(f:Feature) {
    this.featuresToLoad++;
    this.features.push(f);
  }


  analyzeList(l:Array<DOMObject>) {
    // Maybe better pick the Biggest guy of  them all


    var res = [];
    var standart:DOMObject = MathUnit.maxParam(l, 'maxDepth');
    var ll = l.length;

    traverse(standart, function analyze(el) {
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
  }

  learn(featureName:string = null) {

  }

}
