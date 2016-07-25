"use strict";
var GC_Grouper_1 = require("./GC_Grouper");
var async = require('async');
var _ = require('underscore');
var u = require('./MathUnit.js').MathUnit;
var phantom = require('phantom');
var cheerio = require("cheerio");
var fs = require('fs');
var request = require("request");
var App = (function () {
    function App() {
        this.MAX_PREV_PAGES = 5;
    }
    App.prototype.parse = function (linkp, cb) {
        var links = [];
        if (~linkp.indexOf(':page')) {
            for (var i = 0; i < this.MAX_PREV_PAGES; ++i) {
                var x = linkp.replace(":page", i.toString());
                links.push(x);
            }
        }
        else
            links.push(linkp);
        var f = function (body, $, cb) {
            var gc_grouper = new GC_Grouper_1.GcGrouper($, body);
            gc_grouper.updateInfoTree();
            var grouperResult = gc_grouper.findModel(cb);
        };
        u.async(this.loadStaticPage.bind(this), links, function superdone(r) {
            u.async(f, r, function superdone2(everything) {
                cb(everything);
            });
        });
    };
    App.prototype.loadTemplate = function (url, endCB) {
        var $ = cheerio.load(fs.readFileSync(url));
        var bod = $('body');
        endCB(bod, $);
    };
    App.prototype.loadStaticPage = function (url, endCB) {
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
        u.GET(url, function (error, response) {
            if (error) {
                endCB(null, null);
            }
            else {
                var $ = cheerio.load(response.body);
                var bod = $('body')[0];
                endCB(bod, $);
            }
        });
        /*request({
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
        });*/
    };
    /*
     Loading dynamic page and scroll it by 10k pix for infinite scrolls
     */
    App.prototype.loadDynamicPage = function (url, endCB) {
        phantom.create().then(function (ph) {
            return ph.createPage().then(function (page) {
                page.open(url).then(function (status) {
                    console.log(page.content);
                    page.evaluate(function () {
                        window.scrollBy(0, 10000);
                        return window.pageYOffset;
                    }).then(function (r) {
                        var x = page.property('content').then(function (content) {
                            var $ = cheerio.load(content);
                            var bod = $('body');
                            endCB(bod);
                        });
                    });
                });
            });
        });
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map