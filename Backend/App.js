"use strict";
var GC_Grouper_1 = require("./GC_Grouper");
var async = require('async');
var _ = require('underscore');
var u = require('./MathUnit.js').MathUnit;
var phantom = require('phantom');
var cheerio = require("cheerio");
var fs = require('fs');
var request = require('requestretry');
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
        var self = this;
        var f = function (body, $, cb) {
            if (!body) {
                console.log('ERROR: NO BODY');
                return;
            }
            var gc_grouper = new GC_Grouper_1.GcGrouper($, body, linkp);
            gc_grouper.updateInfoTree();
            gc_grouper.findModel(function (res) {
                self.images = gc_grouper.images;
                cb(res);
            });
        };
        u.async(this.loadDynamicPage.bind(this), links, function superdone(r) {
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
        console.log('loading static page: ' + url);
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
        /* u.GET(url, function (error, response) {
          if (error) {
            endCB(null, null);
          } else {
    
            var $:Function = cheerio.load(response.body);
            console.log(response.body);
            var bod = $('body')[0];
            endCB(bod, $);
          }
        });*/
        request({
            uri: url,
            maxAttempts: 5,
            retryDelay: 5000,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                endCB(null, null);
            }
            else {
                var $ = cheerio.load(body);
                var bod = $('body')[0];
                endCB(bod, $);
            }
        });
    };
    /*
     Loading dynamic page and scroll it by 10k pix for infinite scrolls
     */
    App.prototype.loadDynamicPage = function (url, endCB) {
        console.log('loading dynamic page');
        var obj = [];
        var urls = [];
        phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']).then(function (ph) {
            var pg = ph.createPage();
            return pg.then(function (page) {
                page.property('viewportSize', { width: 1024, height: 768 }).then(function () {
                    page.property('customHeaders', {}).then(function () {
                        page.property('customHeaders', {
                            'Host': 'localhost:1337',
                            'Connection': 'keep-alive',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
                            'Accept-Encoding': 'gzip, deflate, sdch',
                            'Accept-Language': 'en-US,en;q=0.8,ru;q=0.6'
                        }).then(function () {
                            page.on('onResourceRequested', function (requestData, networkRequest, obj) {
                                urls.push(requestData.url); // this would push the url into the urls array above
                                obj.push('asdasdsa');
                                console.log('Request ' + JSON.stringify(request, undefined, 4));
                            }, obj);
                            page.open(url).then(function (status) {
                                //console.log(page.content);
                                page.evaluate(function () {
                                    window.scrollBy(0, 10000);
                                    return window.pageYOffset;
                                }).then(function (r) {
                                    var x = page.property('content').then(function (content) {
                                        var $ = cheerio.load(content);
                                        var bod = $('body');
                                        endCB(bod[0]);
                                    });
                                });
                            });
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