export class MathUnit {
    maxParam (a:Array<any>, paramName) {
        var maxEl = a[0];
        var len = a.length;
        for (var i = 1; i < len; ++i) {
            if (maxEl[paramName] < a[i][paramName]) {
                maxEl = a[i];
            }
        }
        return maxEl;
    }


    argmax (f, paramsArray) {
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