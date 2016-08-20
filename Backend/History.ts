import * as BTD from './BTreeDictionary/BTDictionary';
import {ImgObj} from "./GC_Grouper";
import {Classify} from "./Classify";
declare function require(name:string):any;

var _ = require("underscore");


//learn feature

class DOMObject {
}

export class History {
  public qf:(q:string, params:Array<Object>, cv:Function) => void;

  track(action:string, table:string, value:string) {
    this.qf('INSERT INTO history (action, location, value, createdat) VALUES ($1, $2, $3, $4)', [action, table, value, null], function (err, res) {
    });
  }

  select(historyId, cb):void {
    this.qf('SELECT * FROM history where id = $1', [historyId], cb);
  }

  remove(historyId) {
    this.qf('DELETE FROM history where id = $1', [historyId], function (err, res) {
      console.log(err, res);
    });
  }


  constructor(queryFunction:(q:string, params:Array<Object>, cv:Function) => void) {
    this.qf = queryFunction;
  }

}
