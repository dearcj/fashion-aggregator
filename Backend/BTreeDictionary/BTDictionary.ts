/**
 * Created by KURWINDALLAS on 09.07.2016.
 */
"use strict";

export class BTDictionary {
    private root: Object;

    constructor () {
        this.root = {};
    }

    private saveNode(n: Object): string {
        var x: string = '';
        for(var prop in n) {
           x += prop + this.saveNode(n[prop]);
        }
        x += '^';
        return x;
    }

    save (): string {
        var s: string = '';
        return this.saveNode(this.root)
    }

    load (str: string) {
        //@@ - parent symbol
        var sl: number = str.length;
        this.root = {};
        var current = this.root;
        var currentList: Array<Object> = [];

        for (var i = 0; i < sl; ++i) {
            var c = str.charAt(i);

            if (c == '^') {
                if (currentList.length == 0) {
                    current = this.root;
                } else
                    current = currentList.pop();
                } else {
                currentList.push(current);
                current[c] = {};

                current = current[c];
            }
        }
    }

    addWord (w: string, strict: boolean = false) {
        var wl: number = w.length;
        var r = this.root;
        for (var i = 0; i < wl; ++i) {
            var c: string = w.charAt(i);
            if (!r[c]) {
                r[c] = {};
            }
            r = r[c];
        }
        if (strict) {
            if (!r['.']) r['.'] = {};
        }
    }

    checkWord (w: string, strict: boolean = false): boolean {
        var wl: number = w.length;
        var r = this.root;
        for (var i = 0; i < wl; ++i) {
            var c: string = w.charAt(i);
            if (!r[c]) {return false;}

            r = r[c];
        }

        if (strict && !r['.']) {
            return false;
        }
        return true;
    }


}