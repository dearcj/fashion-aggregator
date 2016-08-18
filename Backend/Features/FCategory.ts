import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";

export class FCategory extends Feature {

  extractValue(e:DOMObject) {
    if (!e)
      console;
    return e.data;
  }

  addChildCategory(category, parentId): void {
    this.dict.addWord(category, true, parentId.toString());
  }

  constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
    super(queryFunction, 'category');
  }
}
