import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";

export class FTitle extends Feature {

  extractValue(e:DOMObject) {
    //brand substraction


    if (e && e.data)
      return e.data;
    return '';
  }

  analyzeDOMElem(e:DOMObject):Object {
    var obj;

    var fcat = this.classify.ft('category');
    var fbrand = this.classify.ft('category');


    if (e.data) {
      obj = fcat.fieldDictIntersection(this.extractValue(e));
      obj.containFeature = 'category';
    } else obj = {information: 0, value: null};


    e[this.dbField] = obj;
    return obj;
  }


  constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, lastCalculate: boolean = false) {
        super(queryFunction, 'title', lastCalculate);
    }
}
