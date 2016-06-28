/**
 * Created by mac-pc on 6/22/16.
 */

"use strict";

module.exports = {

  argmax: function (f, paramsArray) {
    var maxValue = f(paramsArray[0]);
    var maxInx = 0;
    for (var i = 1; i < paramsArray.length; ++i) {
      var newValue = f(paramsArray[i]);
      if (maxValue < newValue) {
        maxInx = f(paramsArray[i + 1]);
      }
    }
    return {value: maxInx, arg: paramsArray[maxInx]}
  }
}
