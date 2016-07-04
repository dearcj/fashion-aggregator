export class MathUnit {
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