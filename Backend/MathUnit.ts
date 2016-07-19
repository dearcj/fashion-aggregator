declare function require(name:string):any;
var as = require('async');
var https = require('https');
var http = require('http');
export module MathUnit {

  export function GET(url:string, cb:Function) {
    var protocol = null;
    if (url.indexOf('https:') == 0) protocol = https;
    if (url.indexOf('http:') == 0) protocol = http;

    if (!protocol) {
      cb(true);
      return;
    }
    //ADD TIMEOUT

    url = encodeURI(url);
    if (protocol) {
      var request = protocol.get(url, function (response, body) {
        cb(null, response);
      });

      request.on('error', function(err) {
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
