/**
 * Created by KURWINDALLAS on 09.07.2016.
 */
"use strict";
var BTDictionary = (function () {
    function BTDictionary() {
        this.wordEndSym = '♦';
        this.root = {};
    }
    BTDictionary.prototype.saveNode = function (n) {
        var x = '';
        for (var prop in n) {
            if (n[prop] != null)
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
    BTDictionary.prototype.removeWord = function (w, strict) {
        if (strict === void 0) { strict = false; }
        var wl = w.length;
        var r = this.root;
        var removeEntirely = false;
        var keys = [];
        function numChildren(node) {
            var c = 0;
            for (var propertyName in node) {
                if (node[propertyName] != null)
                    c++;
            }
            return c;
        }
        for (var i = 0; i < wl; ++i) {
            var c = w.charAt(i);
            if (!r[c]) {
                return false;
            }
            keys.unshift({ objSym: c, parent: r, cur: r[c] });
            r = r[c];
            if (i == wl - 1) {
                if ((r[this.wordEndSym])) {
                }
            }
        }
        var kl = keys.length;
        for (var i = 0; i < kl; ++i) {
            var cur = keys[i];
            var childNum = numChildren(cur.cur);
            if (childNum == 0 || (cur.cur[this.wordEndSym] && childNum == 1)) {
                cur.parent[cur.objSym] = null;
            }
        }
        if (strict && !r[this.wordEndSym]) {
            return false;
        }
        return true;
    };
    BTDictionary.prototype.addWord = function (w, strict) {
        if (strict === void 0) { strict = true; }
        w = w.toLowerCase();
        w = w.replace(/^/g, '');
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
            if (!r[this.wordEndSym])
                r[this.wordEndSym] = {};
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
        if (strict && !r[this.wordEndSym]) {
            return false;
        }
        return true;
    };
    return BTDictionary;
}());
exports.BTDictionary = BTDictionary;
//# sourceMappingURL=BTDictionary.js.map