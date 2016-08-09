import { Feature } from "./Feature";

export class FCategory extends Feature {

  addChildCategory(category, parentId): void {
    this.dict.addWord(category, true, parentId.toString());
  }

  constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
    super(queryFunction, 'category');
  }
}
