import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";

export class FBrand extends Feature {

  extractValue(e:DOMObject) {
    if (!e)
      console;
    return e.data;
  }

  analyzeDOMElem (e: DOMObject): Object {
    var obj;
    if (e.data) {
      obj = this.fieldDictIntersection(this.extractValue(e));
    } else obj = {information: 0, value: null};

    console.log(obj.information, obj.value, e.data);

    e[this.dbField] = obj;
    return obj;
   }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'brand');
    }
}
