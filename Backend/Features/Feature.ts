import * as BTD from '../BTreeDictionary/BTDictionary';


class DOMObject  {}


export abstract class Feature {
    private dict: BTD.BTDictionary;
    public qf: (q: string, params: Array<Object>, cv: Function) => void;

    initDictionary(dbField, cb): void {
        var self = this;
        this.dbField = dbField;
        this.dict = new BTD.BTDictionary();
        if (this.dbField)
            this.qf('SELECT * FROM features f where f.name = $1', [this.dbField], function (err, res) {
                if (!err) {
                    if (res[0].dictionary) self.dict = res[0].dictionary;
                    cb();
                }
            });
    }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, dbField: string, cb: Function) {
        this.qf = queryFunction;
        this.dbField = dbField;
        this.initDictionary(dbField, cb);
    }

    dbField: string;

    analyzeDOMElem (e: DOMObject) {
    }
}
