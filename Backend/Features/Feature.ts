///<reference path="../GC_Grouper.ts" />
class DOMObject  {}

///<reference path="../BTreeDictionary/BTDictionary.ts" />
class BTDictionary {}

export class Feature {
    private dict: BTDictionary;
    public qf: (q: string, params: Array<Object>, cv: Function) => void;

    initDictionary(dbField) {
        this.dbField = dbField;
        this.dict = new BTDictionary();
        if (this.dbField)
            this.qf('SELECT * FROM features f where f.name = $1', [this.dbField], function (err, res) {
                if (!err) {
                    console.log();
                }
            });
    }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, dbField: string) {
        this.qf = queryFunction;
        this.dbField = dbField;
    }

    dbField: string;

    analyzeDOMElem (e: DOMObject) {
    }
}
