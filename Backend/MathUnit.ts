declare function require(name:string):any;
var as = require('async');
var https = require('https');
var http = require('http');
declare var sails: any;

export module MathUnit {


  export function fastCheckStr(m: string): RegExpMatchArray {
    return m.match('^[a-zA-Z0-9]*$');
  }

  export function GET(url:string, cb:Function, initReq: Function) {
    var protocol = null;

    if (url.indexOf('https:') == 0) protocol = https;
    if (url.indexOf('http:') == 0) protocol = http;

    if (!protocol) {
      cb(false);
      return;
    }

    var finished = false;

    url = encodeURI(url);
    if (protocol) {
      var body: string = '';

      var request = protocol.get(url, function response(response) {
        if (initReq) {
          initReq(request, response);
        } else {

          response.on('data', function (d) {
            body += d;
          });

          response.on('end', function () {
            finished = true;
            response.body = body;
            cb(null, response);
          });

          response.on('error', function (err) {
            finished = true;
            cb(err);
          });
        }
      });

      var timeout = 12000;
      if (typeof sails != 'undefined') timeout = sails.config.globalTimeout;

      request.setTimeout( timeout, function( ) {
        if (!finished) request.abort();
      });

      request.on('error', function(err) {
        finished = true;
        cb(err);
      });
    } else cb(true);
  }


  export function async(f:Function, params:Array<Array<any>>, done:Function) {
    var delay:number = 500;
    var results:Array<any> = [];
    var works:Array<Function> = [];
    var prms:Array<any>;
    var count = 0;
    var cb = function eachcb(...res) {
      results.push(res);
      if (results.length == params.length) done(results);
    };
    for (var i:number = 0; i < params.length; ++i) {
      works.push(function (i) {
        if (Array.isArray(params[i])) {
          params[i].push(cb);
          prms = params[i];
        } else {
          prms = [];
          prms.push(params[i]);
          prms.push(cb);
        }

        f.apply(this, prms);
      }.bind(this, i));
    }

    for (var i = 0; i < works.length; ++i) {
      setTimeout(works[i], i * delay);
    }

    /*  as.parallel(works, function d() {
     done(results);
     });*/
  }


  export function maxParam(a:Array<any>, paramName:string) {
    var maxEl = a[0];
    var len = a.length;
    for (var i = 1; i < len; ++i) {

      if (!a[i])
        console;

      if (maxEl[paramName] < a[i][paramName]) {
        maxEl = a[i];
      }
    }
    return maxEl;
  }


  export function argmax(f:Function, paramsArray:Array<any>):any {
    var maxValue = f(paramsArray[0]);
    var maxInx = 0;
    for (var i = 1; i < paramsArray.length; i++) {
      var newValue = f(paramsArray[i]);
      if (maxValue < newValue) {
        maxInx = i;
        maxValue = newValue;
      }
    }
    return {value: maxValue, arg: paramsArray[maxInx]}
  }
}
