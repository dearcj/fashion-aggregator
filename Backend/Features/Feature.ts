import * as BTD from '../BTreeDictionary/BTDictionary';
declare function require(name:string): any;

var _ = require("underscore");


class DOMObject  {}


export abstract class Feature {
    public dict: BTD.BTDictionary;
    public qf: (q: string, params: Array<Object>, cv: Function) => void;


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

    analyzeList (l: Array<DOMObject>): void {
      _.each(l, function (x) {
        this.analyzeDOMElem(x);
      }.bind(this))

    }

    analyzeDOMElem (e: DOMObject) {
    }
}
