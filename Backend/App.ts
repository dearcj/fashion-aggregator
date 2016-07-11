declare function require(name:string): any;

var phantom = require('phantom');
var cheerio = require("cheerio");
var fs = require('fs');
var request = require("request");

export class App {


    loadTemplate (url: string, endCB: Function) {
        var $ = cheerio.load(fs.readFileSync(url));
        var bod = $('body');
        endCB(bod, $);
    }

    loadStaticPage (url: string, endCB: Function) {
        request({
            uri:url,
        }, function(error, response, body) {
            var $ = cheerio.load(body);
            var bod = $('body');
            endCB(body, $);
        });
    }

    /*
    Loading dynamic page and scroll it by 10k pix for infinite scrolls
     */
    loadDynamicPage (url: string, endCB: Function) {
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
    }

}