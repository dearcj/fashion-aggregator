import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";

export class FPrice extends Feature {
    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'price');
    }

  extractValue (s: string): number {
    var match: Array<string> = s.match(/[+\-]?\d+(,\d+)?(\.\d+)?/);
    if (match.length == 0) return null; else {
      return parseFloat(match[0]);
    }
  }

  analyzeDOMElem (e: DOMObject) {
    var bestValue = -1;
    if (e.data) {
      var sub = e.data.split(' ');
      var currency = null;
      var sl = sub.length;

      for (var i = 0; i < sl; ++i) {
        var c = this.dict.checkWord(sub[i], false);
        if (c) {
          currency = c;
            var inx = e.data.indexOf(currency);
            var rest = e.data.substr(inx);
            var value = this.extractValue(rest);
            if (value && value > bestValue) {
              bestValue = value;
              console.log(bestValue);
            }


        }

      }

    }
  }
}
