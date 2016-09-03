import { Feature } from "./Feature";
import { DOMObject } from "../GC_Grouper";

export class FLink extends Feature {

  extractValue(s: string) {
    return '';
  }


  analyzeDOMElem (e: DOMObject): Object {
    var inf: number = 0;

    var fcat = this.classify.ft('category');
    var fbrand = this.classify.ft('brand');
    var ftitle = this.classify.ft('title');

    if (e.name == 'a' && e.attribs['href']) {
      var possibleLink = e.attribs['href'];
      if (possibleLink.indexOf(this.classify.domain) >= 1) inf = 0.5;

      var substr = e.data.split('-');
      for (var i = 0, l = substr.length; i < l; ++i) {
        var objCat = fcat.fieldDictIntersection(substr[i]);
        var objBrand = fbrand.fieldDictIntersection(substr[i]);
        var objTitle = ftitle.fieldDictIntersection(substr[i]);
        inf += Math.max(objCat.information, objBrand.information, objTitle.information);
      }

    }

    return {information: inf};
  }

  constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, lastCalculate: boolean = false) {
        super(queryFunction, 'link', lastCalculate);
  }
}
