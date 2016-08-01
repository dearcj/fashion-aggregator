import { Feature } from "./Feature";

export class FBrand extends Feature {

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'brand');
    }
}
