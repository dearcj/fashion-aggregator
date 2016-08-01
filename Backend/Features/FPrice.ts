import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";
declare function require(name:string): any;

var _ = require("underscore");

export class FPrice extends Feature {
    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'price');
    }

  extractValue (s: string): number {
    var match: Array<string> = s.match(/[+\-]?\d+(,\d+)?(\.\d+)?/);
    if (!match) return null; else {
      return parseFloat(match[0]);
    }
  }

 /* analyzeList (l: Array<DOMObject>): void {
    var self = this;
    _.each(l, function (x) {
      self.analyzeDOMElem(x);
    }.bind(this))
  }*/

  analyzeDOMElem (e: DOMObject): Object {
    var bestValue = -1;
    var inf: number = 0;
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
              inf = (value.toString().length + c.length) / e.data.length;
            }
        }
      }
    }

    e.price = {value: bestValue, currency: c};
    return {information: inf};
  }
}
