/**
 * Created by KURWINDALLAS on 09.07.2016.
 */
"use strict";
var BTDictionary = (function () {
    function BTDictionary() {
        this.root = {};
    }
    BTDictionary.prototype.saveNode = function (n) {
        var x = '';
        for (var prop in n) {
            x += prop + this.saveNode(n[prop]);
        }
        x += '^';
        return x;
    };
    BTDictionary.prototype.save = function () {
        var s = '';
        return this.saveNode(this.root);
    };
    BTDictionary.prototype.load = function (str) {
        //@@ - parent symbol
        var sl = str.length;
        this.root = {};
        var current = this.root;
        var currentList = [];
        for (var i = 0; i < sl; ++i) {
            var c = str.charAt(i);
            if (c == '^') {
                if (currentList.length == 0) {
                    current = this.root;
                }
                else
                    current = currentList.pop();
            }
            else {
                currentList.push(current);
                current[c] = {};
                current = current[c];
            }
        }
    };
    BTDictionary.prototype.addWord = function (w, strict) {
        if (strict === void 0) { strict = false; }
        var wl = w.length;
        var r = this.root;
        for (var i = 0; i < wl; ++i) {
            var c = w.charAt(i);
            if (!r[c]) {
                r[c] = {};
            }
            r = r[c];
        }
        if (strict) {
            if (!r['.'])
                r['.'] = {};
        }
    };
    BTDictionary.prototype.checkWord = function (w, strict) {
        if (strict === void 0) { strict = false; }
        var wl = w.length;
        var r = this.root;
        for (var i = 0; i < wl; ++i) {
            var c = w.charAt(i);
            if (!r[c]) {
                return false;
            }
            r = r[c];
        }
        if (strict && !r['.']) {
            return false;
        }
        return true;
    };
    return BTDictionary;
}());
exports.BTDictionary = BTDictionary;
//# sourceMappingURL=BTDictionary.js.map