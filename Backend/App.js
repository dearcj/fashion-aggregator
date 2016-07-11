"use strict";
var phantom = require('phantom');
var cheerio = require("cheerio");
var fs = require('fs');
var request = require("request");
var App = (function () {
    function App() {
    }
    App.prototype.loadTemplate = function (url, endCB) {
        var $ = cheerio.load(fs.readFileSync(url));
        var bod = $('body');
        endCB(bod, $);
    };
    App.prototype.loadStaticPage = function (url, endCB) {
        request({
            uri: url
        }, function (error, response, body) {
            var $ = cheerio.load(body);
            var bod = $('body');
            endCB(body, $);
        });
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