import { GcGrouper } from "./GC_Grouper";
import { Feature } from "./Features/Feature";
import { FImage } from "./Features/FImage";
import { FBrand } from "./Features/FBrand";
import { FLink } from "./Features/FLink";
import { FPrice } from "./Features/FPrice";
import { FTitle } from "./Features/FTitle";
import { DOMObject } from "./GC_Grouper";
import { traverse } from "./GC_Grouper";

declare function require(name:string): any;
var _ = require("underscore");
var MathUnit = require('./MathUnit.js');

export class Classify {
    featuresToLoad: number = 0;
    featuresLoaded: number = 0;
    allFeaturesLoaded: Function = null;
    grouper: GcGrouper;
    private features: Array<Feature> = [];

    onLoadedFeature() {
        this.featuresLoaded++;
        if (this.featuresLoaded == this.featuresToLoad) {
          this.allFeaturesLoaded();
        }
    }

    constructor(grouper, queryFunction: (q: string, params: Array<Object>) => void, allLoaded: Function) {
        this.addFeature(new FImage(queryFunction, this.onLoadedFeature));
        this.addFeature(new FBrand(queryFunction, this.onLoadedFeature));
        this.addFeature(new FLink(queryFunction,  this.onLoadedFeature));
        this.addFeature(new FPrice(queryFunction, this.onLoadedFeature));
        this.addFeature(new FTitle(queryFunction, this.onLoadedFeature));
        this.addFeature(new FImage(queryFunction, this.onLoadedFeature));
        this.grouper = grouper;
        this.allFeaturesLoaded = allLoaded;
    }

    addFeature(f: Feature) {
        this.featuresToLoad++;
        this.features.push(f);
    }


    analyzeList(l: Array<DOMObject>) {
        // Maybe better pick the Biggest guy of  them all


        var res = [];
        var standart: DOMObject = MathUnit.maxParam(l, 'maxDepth');
        var ll = l.length;

        traverse(standart, function analyze(el) {
          var rule = this.grouper.getRule(el, standart, true);

          var stack = [];

          for (var i = 0; i < ll; ++i) {
            var obj = this.grouper.getObjByRule(rule, l[i]);
            if (obj) {
              stack.push(obj);
            }
          }


          //ANALYZE STACK

          //get rule of el
        });


        return res;
    }

    learn(featureName: string = null){

    }

}
