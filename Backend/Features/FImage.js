"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var GC_Grouper_1 = require("../GC_Grouper");
var FImage = (function (_super) {
    __extends(FImage, _super);
    function FImage(queryFunction) {
        _super.call(this, queryFunction, 'image');
    }
    FImage.prototype.extractValue = function (e) {
        if (e && e.name == 'img') {
            //there should be finding link algorithm
            var imgs = GC_Grouper_1.GcGrouper.getImagesFromObj(e);
            for (var i = 0, il = imgs.length; i < il; ++i) {
                if (this.isBigImage(imgs[i])) {
                    return { value: imgs[i] };
                }
            }
        }
        return null;
    };
    FImage.prototype.isBigImage = function (link) {
        for (var i = 0, tl = this.images.length; i < tl; ++i) {
            if (this.images[i].url == link)
                return true;
        }
        return false;
    };
    FImage.prototype.analyzeDOMElem = function (e) {
        var value = this.extractValue(e);
        var information = 0;
        if (value)
            information = 1;
        return { information: information, value: value ? value.value : null };
    };
    return FImage;
}(Feature_1.Feature));
exports.FImage = FImage;
//# sourceMappingURL=FImage.js.map