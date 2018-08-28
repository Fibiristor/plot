/**
 * Created by fibiristor on 2018/3/9.
 */
/*合并利润数据*/
function combineProfit(data1Profit,data2Profit) {
    /*定义Format方法*/
    Date.prototype.Format = function () {
        var year = this.getFullYear();
        var month = this.getMonth() + 1;
        var day = this.getDate();
        var formatDate = year + "/" + month + "/" + day;
        return formatDate;
    }

    /*数据1的开始日期*/
    var beginDayOfData1 = data1Profit[0][0];
    var lastDayIndexOfData1 = data1Profit.length - 1;
    /*数据1的结束日期*/
    var lastDayOfData1 = data1Profit[lastDayIndexOfData1][0];

    /*数据2的开始日期*/
    var beginDayOfData2 = data2Profit[0][0];
    var lastDayIndexOfData2 = data2Profit.length - 1;
    /*数据2的结束日期*/
    var lastDayOfData2 = data2Profit[lastDayIndexOfData2][0];

    //计算所涉及品种的最早起始日期和结束日期
    var bD1 = new Date(beginDayOfData1);
    var eD1 = new Date(lastDayOfData1);

    var bD2 = new Date(beginDayOfData2);
    var eD2 = new Date(lastDayOfData2);

    var minDate = new Date(Math.min(bD1, bD2, eD1, eD2));
    var maxDate = new Date(Math.max(bD1, bD2, eD1, eD2));


    //产生minDate到maxDate的全程数组
    var combineData = [];
    while (maxDate.getTime() - minDate.getTime() >= 0) {
        var dataTemp = [];
        dataTemp.push(minDate.Format("yyyy/MM/dd"));
        dataTemp.push(0);
        combineData.push(dataTemp);
        minDate.setDate(minDate.getDate() + 1);
    }


    //依据日期将data1合并到combineData中
    var indexChange = 0;
    for (var i = 0; i < combineData.length; i++) {
        for (var j = indexChange + 1; j < data1Profit.length; j++) {
            if (data1Profit[j][0] == combineData[i][0]) {
                combineData[i][1] = data1Profit[j][1] + combineData[i][1];
                indexChange = j;//记录本次已经查询的索引号，下次查询从此号开始
                break;
            }
        }
    }

    //依据日期将data2合并到combineData中
    var indexChange1 = 0;
    for (var i = 0; i < combineData.length; i++) {
        for (var j = indexChange1 + 1; j < data2Profit.length; j++) {
            if (data2Profit[j][0] == combineData[i][0]) {
                combineData[i][1] = data2Profit[j][1] + combineData[i][1];
                indexChange1 = j;//记录本次已经查询的索引号，下次查询从此号开始
                break;
            }
        }
    }

    return combineData;

}