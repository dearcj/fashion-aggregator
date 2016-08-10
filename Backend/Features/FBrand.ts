import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";

export class FBrand extends Feature {

  extractValue(e:DOMObject) {
    return e.data;
  }

  analyzeDOMElem (e: DOMObject): Object {
    var obj;
    if (e.data) {
      obj = this.fieldDictIntersection(this.extractValue(e));
    } else obj = {information: 0, value: null};

    e[this.dbField] = obj;
    return obj;
   }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'brand');
    }
}
