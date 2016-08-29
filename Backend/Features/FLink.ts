import { Feature } from "./Feature";
import { DOMObject } from "../GC_Grouper";

export class FLink extends Feature {

  extractValue(s: string) {
    return '';
  }


  analyzeDOMElem (e: DOMObject): Object {
    var inf: number = 0;

    if (e.data) {
      if (e.data.indexOf(this.classify.domain) >= 1) inf = 0.5;
      
      var substr = e.data.split('-');
      for (var i = 0, l = substr.length; i < l; ++i) {
        substr[i];
      }

    }

    return {information: inf};
  }

  constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, lastCalculate: boolean = false) {
        super(queryFunction, 'link', lastCalculate);
  }
}
