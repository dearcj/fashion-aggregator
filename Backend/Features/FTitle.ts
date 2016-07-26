import { Feature } from "./Feature";

export class FTitle extends Feature {
    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, cb: Function) {
        super(queryFunction, 'title', cb);
    }
}
