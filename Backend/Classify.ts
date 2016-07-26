import { GcGrouper } from "./GC_Grouper";
import { Feature } from "./Features/Feature";
import { FImage } from "./Features/FImage";
import { FBrand } from "./Features/FBrand";
import { FLink } from "./Features/FLink";
import { FPrice } from "./Features/FPrice";
import { FTitle } from "./Features/FTitle";
import { DOMObject } from "./GC_Grouper";

declare function require(name:string): any;
var _ = require("underscore");
var MathUnit = require('./MathUnit.js');
var GC_Grouper = require('./GC_Grouper.js');

export class Classify {
    featuresToLoad: number = 0;
    featuresLoaded: number = 0;
    allFeaturesLoaded: Function = null;
    private features: Array<Feature> = [];

    onLoadedFeature() {
        this.featuresLoaded++;
        if (this.featuresLoaded == this.featuresToLoad) {
          this.allFeaturesLoaded();
        }
    }

    constructor(queryFunction: (q: string, params: Array<Object>) => void, allLoaded: Function) {
        this.addFeature(new FImage(queryFunction, this.onLoadedFeature));
        this.addFeature(new FBrand(queryFunction, this.onLoadedFeature));
        this.addFeature(new FLink(queryFunction,  this.onLoadedFeature));
        this.addFeature(new FPrice(queryFunction, this.onLoadedFeature));
        this.addFeature(new FTitle(queryFunction, this.onLoadedFeature));
        this.addFeature(new FImage(queryFunction, this.onLoadedFeature));

        this.allFeaturesLoaded = allLoaded;
    }

    addFeature(f: Feature) {
        this.featuresToLoad++;
        this.features.push(f);
    }


    analyzeList(l: Array<DOMObject>) {
        // Maybe better pick the Biggest guy of  them all
        var res = [];

        var standart = MathUnit.maxParam(l, 'maxDepth');


   //   GC_Grouper.traverse();

        _.each(l, function (el) {


        });

        return res;
    }

    learn(featureName: string = null){

    }

}
