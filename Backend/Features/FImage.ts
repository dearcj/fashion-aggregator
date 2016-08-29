import { Feature } from "./Feature";
import {DOMObject} from "../GC_Grouper";
import {ImgObj} from "../GC_Grouper";
import {GcGrouper} from "../GC_Grouper";

export class FImage extends Feature {
    images: Array<ImgObj>;

  extractValue(e:DOMObject) {
    if (e && e.name == 'img') {

      //there should be finding link algorithm

      var imgs = GcGrouper.getImagesFromObj(e);
      for (var i = 0, il = imgs.length; i < il; ++i) {
        if (this.isBigImage(imgs[i])) {
          return {value: imgs[i]};
        }
      }
    }

    return null;
  }

    isBigImage (link: string): boolean {
      for (var i = 0, tl = this.images.length; i < tl; ++i) {
        if (this.images[i].url == link) return true;
      }
      return false;
    }

    analyzeDOMElem (e: DOMObject): Object {
      var value = this.extractValue(e);

      var information: number = 0;
      if (value) information = 1;
      return {information: information, value: value ? value.value : null}
    }

    constructor (queryFunction: (q: string, params: Array<Object>, cv: Function) => void, lastCalculate: boolean = false) {
        super(queryFunction, 'image', lastCalculate);
    }

}
