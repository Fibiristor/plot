/**
 * Created by fibiristor on 2018/3/12.
 */
function ATR(csvData,days) {

    var trData = [];
    trData.push(csvData[0][2] - csvData[0][3]);
    for (var i = 1; i < csvData.length; i++) {
        var tempData = d3.max([csvData[i][2] - csvData[i][3],//最高价-最低价
            csvData[i][2] - csvData[i - 1][4],//最高价-昨日收盘价
            csvData[i - 1][4] - csvData[i][3]]);//昨日收盘价-最低价
        trData.push(tempData);
    }
    var sum = 0;
    for(var i = 0; i < days; i++){
        sum = sum + trData[i];
    }
    var DN20 = Math.round((sum/days)*100)/100;

    var N20 = [];
    var PDN = 0;
    for(var i = days; i<trData.length; i++){
        if(i == days){
            PDN = DN20;
            N20.push(PDN);
            continue;
        }
        PDN = Math.round(((19*PDN + trData[i])/days)*100)/100;
        N20.push(PDN);
    }
    return N20;

}
