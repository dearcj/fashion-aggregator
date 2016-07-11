import { GcGrouper } from "./GC_Grouper.ts";
import { Feature } from "./Features/Feature.ts";
import { FImage } from "./Features/FImage.ts";
import { FBrand } from "./Features/FBrand.ts";
import { FLink } from "./Features/FLink.ts";
import { FPrice } from "./Features/FPrice.ts";
import { FTitle } from "./Features/FTitle.ts";


export class Classify {
    grouper: GcGrouper;

    constructor(g: GcGrouper, queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        this.grouper = g;
        this.addFeature(new FImage(queryFunction, 'image'));
        this.addFeature(new FBrand(queryFunction, 'brand'));
        this.addFeature(new FLink(queryFunction, 'link'));
        this.addFeature(new FPrice(queryFunction, 'price'));
        this.addFeature(new FTitle(queryFunction, 'title'));
    }

    addFeature(f: Feature) {
        this.features.push(f);
    }

    private features: Array<Feature>;

    analyzeList(l: Array<DOMObject>) {
        var standart = l[0]; // Maybe better pick the Biggest guy of  them all

    }
}