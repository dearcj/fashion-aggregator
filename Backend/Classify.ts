/**
 * Created by mac-pc on 7/8/16.
 */

class GcGrouper {}
class DOMObject {}





class Classify {
    grouper: GcGrouper;

    constructor(g: GcGrouper) {
        this.grouper = g;
    }

    addFeature(f: Feature) {
        this.features.push(f);
    }

    private features: Array<Feature>;

    analyzeList(l: Array<DOMObject>) {
        var standart = l[0]; // Maybe better pick the Biggest guy of  them all

    }
}