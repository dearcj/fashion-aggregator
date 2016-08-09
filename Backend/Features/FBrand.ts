import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";

export class FBrand extends Feature {

  extractValue(s: string) {
    return '';
  }

  analyzeDOMElem (e: DOMObject): Object {
    var obj;
    if (e.data) {
      obj = this.fieldDictIntersection(e.data);
    } else obj = {information: 0, value: null};

    console.log('!!!!!!!' + obj.information);

    e[this.dbField] = obj;
    return obj;
   }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'brand');
    }
}
