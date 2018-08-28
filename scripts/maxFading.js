/**
 * Created by fibiristor on 2018/4/8.
 */
function maxFading(profit) {
    // var data = getData("candle.csv", "text", false);
    // var closeData = [];
    // for (var i = 0; i < data.length; i++) {
    //     closeData.push(parseFloat(data[i][4]));
    // }
    var closeData = profit;

    var minValue = closeData[0];
    var maxValue = closeData[0];
    var iMax = 0;
    var iMin = 0;

    // var diff = [{"max":0,"min":0,"diff":0}];
    var diff = [];

    for (var i = 1; i < closeData.length; i++) {
        if(closeData[i] > maxValue){
            maxValue = closeData[i];
            minValue = closeData[i];
            iMax = i;
            iMin = i;
            continue;
        }else if(closeData[i] < minValue){
            minValue = closeData[i];
            iMin = i;
            var tempDiff = new diffObject(maxValue,minValue,iMax,iMin);
            diff.push(tempDiff);
        }
    }
    console.log(diff);

    function diffObject(maxValue, minValue, iMax, iMin) {
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.iMax = iMax;
        this.iMin = iMin;
        this.percentDown = Math.round(((maxValue - minValue) / maxValue) * 100 * 100) / 100;
    }
}

