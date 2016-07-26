import { Feature } from "./Feature";

export class FPrice extends Feature {
    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, cb: Function) {
        super(queryFunction, 'price', cb);
    }
}
