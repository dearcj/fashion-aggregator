"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Feature_1 = require("./Feature");
var FImage = (function (_super) {
    __extends(FImage, _super);
    function FImage(queryFunction) {
        _super.call(this, queryFunction, 'image');
    }
    FImage.prototype.isBigImage = function (link) {
        for (var i = 0, tl = this.images.length; i < tl; ++i) {
            if (this.images[i].url == link)
                return true;
        }
        return false;
    };
    FImage.prototype.analyzeDOMElem = function (e) {
        var value;
        var information = 0;
        if (e.name == 'img' && this.isBigImage(e.attribs['src'])) {
            information = 1;
            e.image = { value: e.attribs['src'] };
        }
        return { information: information, value: value };
    };
    return FImage;
}(Feature_1.Feature));
exports.FImage = FImage;
//# sourceMappingURL=FImage.js.map