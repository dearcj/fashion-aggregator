import { Feature } from "./Feature";

export class FTitle extends Feature {

  extractValue(s: string) {
    return '';
  }


  constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'title');
    }
}
