import { Feature } from "./Feature";

export class FLink extends Feature {

  extractValue(s: string) {
    return '';
  }

  constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'link');
    }
}
