import { Feature } from "./Feature";

export class FCategory extends Feature {

  constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
    super(queryFunction, 'category');
  }
}
