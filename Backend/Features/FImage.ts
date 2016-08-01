import { Feature } from "./Feature";

export class FImage extends Feature {
    
    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'image');
    }

}
