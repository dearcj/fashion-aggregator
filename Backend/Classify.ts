import { GcGrouper } from "./GC_Grouper";
import { Feature } from "./Features/Feature";
import { FImage } from "./Features/FImage";
import { FBrand } from "./Features/FBrand";
import { FLink } from "./Features/FLink";
import { FPrice } from "./Features/FPrice";
import { FTitle } from "./Features/FTitle";
import { DOMObject } from "./GC_Grouper";




export class Classify {
    grouper: GcGrouper;

    constructor(g: GcGrouper, queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        this.grouper = g;
        var f = new FImage(queryFunction);
        this.addFeature(f);
        this.addFeature(new FBrand(queryFunction));
        this.addFeature(new FLink(queryFunction));
        this.addFeature(new FPrice(queryFunction));
        this.addFeature(new FTitle(queryFunction));
    }

    addFeature(f: Feature) {
        this.features.push(f);
    }

    private features: Array<Feature>;

    analyzeList(l: Array<DOMObject>) {
        var standart = l[0]; // Maybe better pick the Biggest guy of  them all

    }
}