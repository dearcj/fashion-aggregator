/**
 * Created by KURWINDALLAS on 09.07.2016.
 */
"use strict";
class BTDictionary {
    constructor() {
        this.root = {};
    }
    saveNode(n) {
        var x = '';
        for (var prop in n) {
            x += prop + this.saveNode(n[prop]);
        }
        x += '^';
        return x;
    }
    save() {
        var s = '';
        return this.saveNode(this.root);
    }
    load(str) {
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
    }
    addWord(w, strict = false) {
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
    }
    checkWord(w, strict = false) {
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
    }
}
exports.BTDictionary = BTDictionary;
//# sourceMappingURL=BTDictionary.js.map