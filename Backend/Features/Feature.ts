import * as BTD from '../BTreeDictionary/BTDictionary';
import {ImgObj} from "../GC_Grouper";
declare function require(name:string): any;

var _ = require("underscore");


class DOMObject  {}


export abstract class Feature {
    public dict: BTD.BTDictionary;
    public qf: (q: string, params: Array<Object>, cv: Function) => void;
    public images: Array<ImgObj>;

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
