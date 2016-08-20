import * as BTD from '../BTreeDictionary/BTDictionary';
import {ImgObj} from "../GC_Grouper";
import {Classify} from "../Classify";
declare function require(name:string): any;

var _ = require("underscore");


class DOMObject  {}

export class ClassifyResults {
  information:number;
  rule:string;
  elements:Array<DOMObject>;
}

export abstract class Feature {
    public dict: BTD.BTDictionary;
    public qf: (q: string, params: Array<Object>, cv: Function) => void;
    public images: Array<ImgObj>;
  public classifyResult:ClassifyResults;
  public classify:Classify;
  
    initDictionary(cb): void {
        var self = this;
        this.dict = new BTD.BTDictionary();
        if (this.dbField)
            this.qf('SELECT * FROM features f where f.name = $1', [this.dbField], function (err, res) {
                if (!err) {
                    if (res[0].dictionary) self.dict.load(res[0].dictionary);
                    cb();
                }
            });
    }

  abstract extractValue(e:DOMObject):any;

    fieldDictIntersection(field: string): any {
      var sub = [];

      field = field.toLowerCase();

      //field.split(' ');
      var sl = sub.length;
      var inf = 0;
      var value = null;
      var str = field.slice(0);
      sub.push(str);
      while (str != '') {
        var inx = str.indexOf(" ");
        if (~inx) {
          str = str.substr(inx + 1);
        } else break;
        if (str != '')
          sub.push(str);
      }

      //vintage tommy hilfiger garbage
      // 1) as is
      // 2) tommy hilfiger garbage
      // 3) hilfiger garbage
      // 4) garbage

      var maxInf = 0;
      var sl = sub.length;
      for (var i = 0; i < sl; ++i) {
        var obj = this.dict.getIntersectionDepth(sub[i]);
        var inf = (obj.count) / field.length;
        if (!obj.prevStrict)
          inf *= 0.15; //penalty for partial word

        maxInf = inf > maxInf ? inf : maxInf;
      }

      return {information: maxInf, value: ''};
    }

    updateDictionary(): void {
      if (this.dbField) {
        var dict = this.dict.save();
        this.qf('UPDATE features SET dictionary = ($1) where name = $2', [dict, this.dbField], function (err, res) {
          if (!err) {
          }
        });
      }



    }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, dbField: string) {
        this.qf = queryFunction;
        this.dbField = dbField;
    }

    dbField: string;

    analyzeList (l: Array<DOMObject>): any {
      var i = 0;
      var self = this;
      _.each(l, function (x) {
        i += self.analyzeDOMElem(x).information;
      }.bind(this));

      var avg = i / l.length;

      return {information: avg}
    }

    analyzeDOMElem (e: DOMObject): any {
      return null;
    }
}
