import * as BTD from '../BTreeDictionary/BTDictionary';


class DOMObject  {}


export abstract class Feature {
    private dict: BTD.BTDictionary;
    public qf: (q: string, params: Array<Object>, cv: Function) => void;

    initDictionary(dbField): void {
        this.dbField = dbField;
        this.dict = new BTD.BTDictionary();
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
        this.initDictionary(dbField);
    }

    dbField: string;

    analyzeDOMElem (e: DOMObject) {
    }
}
