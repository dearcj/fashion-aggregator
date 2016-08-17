import {DOMObject} from "./GC_Grouper";
import {GcGrouper} from "./GC_Grouper";
import {ImgObj} from "./GC_Grouper";

declare function require(name:string):any;

var async = require('async');
var _ = require('underscore');
var u = require('./MathUnit.js').MathUnit;

var phantom = require('phantom');
var cheerio = require("cheerio");
var fs = require('fs');
var request = require('requestretry');

export class App {

  MAX_PREV_PAGES:number = 5;
  images: Array<ImgObj>;
  parse(linkp:string, cb:Function) {
    var links = [];

    if (~linkp.indexOf(':page')) {
      for (var i:number = 0; i < this.MAX_PREV_PAGES; ++i) {
        var x = linkp.replace(":page", i.toString());
        links.push(x);
      }
    } else links.push(linkp);

    var self = this;
    var f = function (body, $, cb) {
      if (!body) {
        console.log('ERROR: NO BODY');
        return;
      }

      var gc_grouper = new GcGrouper($, body, linkp);
      gc_grouper.updateInfoTree();
      gc_grouper.findModel(function (res) {
        self.images = gc_grouper.images;
        cb(res);
      });
    };

    u.async(this.loadDynamicPageWithInject.bind(this), links, function superdone(r) {

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
      maxAttempts: 5,   // (default) try 5 times
      retryDelay: 5000,  // (default) wait for 5s before trying again
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError
    }, function (error, response, body) {

      if (error) {
        console.log(error);
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
    console.log('loading dynamic page');

    var obj = [];
    var urls = [];
    var pg= null, ph = null;

    phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'])
      .then(function (instance:any) {
        ph = instance;
        return pg = ph.createPage();

      })
      .then(function(page:any){
        return  page.property('viewportSize', {width: 1024, height: 768});

      }).then(function(page:any){
        return  page.setting('userAgent', 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1b2) Gecko/20081201 Firefox/3.1b2');

      }).then(function(page:any){
        return  page.property('customHeaders', {
          "Accept-Language": "en-US,en;q=0.5"
        });

      }).then(function(page:any){
        page.on('onResourceRequested', function(requestData, networkRequest){
          urls.push(requestData.url); // this would push the url into the urls array above
          obj.push('asdasdsa');
          console.log('Request ' + JSON.stringify(request, undefined, 4));

        });

        page.on('onInitialized',true, function(){
          page.invokeMethod('injectJs','./helpers/phantom/polyfill.js');

        });

        return  page.open(url);

      }).then(function(status){

        if(status){

          pg.evaluate(function () {
            window.scrollBy(0, 10000);
            return window.pageYOffset;

          }).then(function (r) {
            var x = page.property('content')
              .then(function (content) {
                var $:Function = cheerio.load(content);
                var bod = $('body');

                pg.close();
                ph.exit();
                endCB(bod[0]);
              });
          });

        }else{
          pg.close();
          ph.exit();
          endCB();
        }

      })

    }

  loadDynamicPageWithInject(url:string, endCB:Function) {
    console.log('loading dynamic page with polyfill');

    var obj = [];
    var urls = [];
    var pg= null, ph = null;

    phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'])//, '--proxy=127.0.0.1:8888'])
      .then(function (instance) {
        ph = instance;
        return ph.createPage();


      })
      .then(function(page){
        pg = page;
        return pg.property('viewportSize', {width: 1024, height: 768});


      }).then(function(){
      return pg.setting('userAgent', 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1b2) Gecko/20081201 Firefox/3.1b2')


    }).then(function(){
      return pg.property('customHeaders', {
        "Accept-Language": "en-US,en;q=0.5"
      });

    }).then(function(){
      return pg.on('onResourceRequested', false, function(requestData, networkRequest){
        urls.push(requestData.url); // this would push the url into the urls array above

      });

    }).then(function(){
      return pg.on('onInitialized', true, function(){
        this.injectJs('./helpers/phantom/polyfill.js');

      });

    }).then(function(){
      return pg.open(url);

    }).then(function(status){
      if(status){
        setTimeout(function(){
          pg.evaluate(function () {
            window.scrollBy(0, 10000);
            return window.pageYOffset;

          }).then(function (r) {
            pg.property('content')
              .then(function (content) {
                var $ = cheerio.load(content);
                var body = $('body');

                pg.close();
                ph.exit();
                endCB(body[0]);
              });
          });

        }, 5000);

      }else{
        pg.close();
        ph.exit();
        endCB();
      }

    }).catch(function(error){
      console.log(error);

      pg.close();
      ph.exit();
      endCB();
    })

  }

}
