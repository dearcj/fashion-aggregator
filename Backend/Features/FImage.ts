import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";
import {ImgObj} from "../GC_Grouper";

export class FImage extends Feature {
    images: Array<ImgObj>;
  
  extractValue(s: string) {
    return '';
  }

    isBigImage (link: string): boolean {
      for (var i = 0, tl = this.images.length; i < tl; ++i) {
        if (this.images[i].url == link) return true;
      }
      return false;
    }

    analyzeDOMElem (e: DOMObject): Object {
      var value: string;
      var information: number = 0;
      if (e.name == 'img' && this.isBigImage(e.attribs['src'])) {
        information = 1;
        e.image = {value: e.attribs['src']};
      }

      return {information: information, value: value}
    }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void) {
        super(queryFunction, 'image');
    }

}
