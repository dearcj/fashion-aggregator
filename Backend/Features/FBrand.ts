import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";

export class FBrand extends Feature {

  extractValue(e:DOMObject, getAll:boolean = false) {
    if (!e) return null;

    if (getAll) return e.data;

    var value = '';
    var s = this.textToStringArray(e.data);
    for (var i = 0, sl = s.length; i < sl; ++i) {
      var x = this.dict.getIntersectionDepth(s[i]);
      if (x.prevStrict && x.count > value.length)
        value = s[i].substr(0, x.count);
    }

    return value;
  }

  analyzeDOMElem (e: DOMObject): Object {
    var obj;
    if (e.data) {
      obj = this.fieldDictIntersection(e.data);
    } else obj = {information: 0, value: null};


    e[this.dbField] = obj;
    return obj;
   }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'brand');
    }
}
