import {DOMObject} from "./GC_Grouper";
import {GcGrouper} from "./GC_Grouper";

declare function require(name:string):any;

var async = require('async');
var _ = require('underscore');
var u = require('./MathUnit.js').MathUnit;

var phantom = require('phantom');
var cheerio = require("cheerio");
var fs = require('fs');
var request:Function = require("request");

export class App {

  MAX_PREV_PAGES:number = 5;

  parse(linkp:string, cb:Function) {
    var links = [];

    if (~linkp.indexOf(':page')) {
      for (var i:number = 0; i < this.MAX_PREV_PAGES; ++i) {
        var x = linkp.replace(":page", i.toString());
        links.push(x);
      }
    } else links.push(linkp);

    var f = function (body, $, cb) {
      var gc_grouper = new GcGrouper($, body);
      gc_grouper.updateInfoTree();
      var grouperResult = gc_grouper.findModel(cb);
    };

    u.async(this.loadStaticPage.bind(this), links, function superdone(r) {

      u.async(f, r, function superdone2(everything) {
        cb(everything);
      });

    });
  }

  loadTemplate(url:string, endCB:Function) {
    var $:Function = cheerio.load(fs.readFileSync(url));
    var bod = $('body');
    endCB(bod, $);
  }

  loadStaticPage(url:string, endCB:Function) {

   /* phantom.create().then(function (ph:any) {
      return ph.createPage().then(function (page:any) {
        page.open(url).then(function (status) {
          console.log(page.content);
          page.evaluate(function () {
            window.scrollBy(0, 10000);
            return window.pageYOffset;
          }).then(function (r) {
            var x = page.property('content').then(function (content) {
              var $:Function = cheerio.load(content);
              var bod = $('body');
              endCB(bod);
            });
          });
        });
      });
    });*/


    request({
      uri: url,
      timeout: 12000
    }, function (error, response, body) {
      if (error) {
        endCB(null, null);
      } else {

        var $:Function = cheerio.load(body);
        var bod = $('body')[0];
        endCB(bod, $);
      }
    });
  }

  /*
   Loading dynamic page and scroll it by 10k pix for infinite scrolls
   */
  loadDynamicPage(url:string, endCB:Function) {
    phantom.create().then(function (ph:any) {
      return ph.createPage().then(function (page:any) {
        page.open(url).then(function (status) {
          console.log(page.content);
          page.evaluate(function () {
            window.scrollBy(0, 10000);
            return window.pageYOffset;
          }).then(function (r) {
            var x = page.property('content').then(function (content) {
              var $:Function = cheerio.load(content);
              var bod = $('body');
              endCB(bod);
            });
          });
        });
      });
    });
  }

}
