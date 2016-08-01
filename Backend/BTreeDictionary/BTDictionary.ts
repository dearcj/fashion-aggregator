/**
 * Created by KURWINDALLAS on 09.07.2016.
 */
"use strict";
declare function require(name:string):any;
var _ = require("underscore");

export class BTDictionary {
  wordEndSym: string = '♦';
  private root:Object;

  constructor() {
    this.root = {};
  }

  private saveNode(n:Object):string {
    var x:string = '';
    for (var prop in n) {
      if (n[prop] != null)
      x += prop + this.saveNode(n[prop]);
    }
    x += '^';
    return x;
  }

  save():string {
    var s:string = '';
    return this.saveNode(this.root)
  }

  load(str:string) {
    //@@ - parent symbol
    var sl:number = str.length;
    this.root = {};
    var current = this.root;
    var currentList:Array<Object> = [];

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

  removeWord(w:string, strict:boolean = true) {
    var wl:number = w.length;
    var r = this.root;
    var removeEntirely = false;
    var keys = [];

    function numChildren(node: Object) {
      var c = 0;
      for(var propertyName in node) {
        if (node[propertyName] != null) c++;
      }
      return c;
    }

    for (var i = 0; i < wl; ++i) {
      var c:string = w.charAt(i);


      if (!r[c]) {
        return false;
      }

      keys.unshift({objSym: c, parent: r, cur: r[c]});

      r = r[c];


      if (i == wl - 1) {
        if ((r[this.wordEndSym])) {
        //  keys.unshift({objSym: '.', parent: r});
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
  }

  addArray(a: Array<string>): void {
    _.each(a, function (el) {
      this.addWord(el);
    }.bind(this));
  }

  addWord(w:string, strict:boolean = true) {
    w = w.toLowerCase();
    w = w.replace(/^/g, '');

    var wl:number = w.length;
    var r = this.root;
    for (var i = 0; i < wl; ++i) {
      var c:string = w.charAt(i);
      if (!r[c]) {
        r[c] = {};
      }
      r = r[c];
    }
    if (strict) {
      if (!r[this.wordEndSym]) r[this.wordEndSym] = {};
    }
  }

  checkWord(w:string, strict:boolean = true):string {
    var wl:number = w.length;
    var r = this.root;
    for (var i = 0; i < wl; ++i) {
      var c:string = w.charAt(i);
      if (!r[c]) {
        return null;
      }



      r = r[c];

      if (!strict) {
        if (r[this.wordEndSym]) return w.substr(0, i + 1);
      }
    }

    if (strict && !r[this.wordEndSym]) {
      return null;
    }
    return w;
  }


}
