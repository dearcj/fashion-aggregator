"use strict";
var as = require('async');
var https = require('https');
var http = require('http');
var MathUnit;
(function (MathUnit) {
    function fastCheckStr(m) {
        return m.match('^[a-zA-Z0-9]*$');
    }
    MathUnit.fastCheckStr = fastCheckStr;
    function GET(url, cb, initReq) {
        var protocol = null;
        if (url.indexOf('https:') == 0)
            protocol = https;
        if (url.indexOf('http:') == 0)
            protocol = http;
        if (!protocol) {
            cb(false);
            return;
        }
        var finished = false;
        url = encodeURI(url);
        if (protocol) {
            var body = '';
            var request = protocol.get(url, function response(response) {
                if (initReq) {
                    initReq(request, response);
                }
                else {
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
            if (typeof sails != 'undefined')
                timeout = sails.config.globalTimeout;
            request.setTimeout(timeout, function () {
                if (!finished)
                    request.abort();
            });
            request.on('error', function (err) {
                finished = true;
                cb(err);
            });
        }
        else
            cb(true);
    }
    MathUnit.GET = GET;
    function async(f, params, done) {
        var delay = 500;
        var results = [];
        var works = [];
        var prms;
        var count = 0;
        var cb = function eachcb() {
            var res = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                res[_i - 0] = arguments[_i];
            }
            results.push(res);
            if (results.length == params.length)
                done(results);
        };
        for (var i = 0; i < params.length; ++i) {
            works.push(function (i) {
                if (Array.isArray(params[i])) {
                    params[i].push(cb);
                    prms = params[i];
                }
                else {
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
    MathUnit.async = async;
    function maxParam(a, paramName) {
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
    MathUnit.maxParam = maxParam;
    function argmax(f, paramsArray) {
        var maxValue = f(paramsArray[0]);
        var maxInx = 0;
        for (var i = 1; i < paramsArray.length; i++) {
            var newValue = f(paramsArray[i]);
            if (maxValue < newValue) {
                maxInx = i;
                maxValue = newValue;
            }
        }
        return { value: maxValue, arg: paramsArray[maxInx] };
    }
    MathUnit.argmax = argmax;
})(MathUnit = exports.MathUnit || (exports.MathUnit = {}));
//# sourceMappingURL=MathUnit.js.map
