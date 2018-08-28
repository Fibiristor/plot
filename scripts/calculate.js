/**
 * Created by fibiristor on 2018/3/18.
 */
/*
 * source:CSV文件
 * type:text类型
 * asy:同步模式
 * */
function getDataFromCSV(source, type, asy) {
    var csvData = [[1, 1, 1, 1, 1, 1]];//tradeDate,open,high,low,close,volume

    //ajax 同步获取csv数据
    $.ajax({
        url: source,
        dataType: type,
        async: asy
    }).done(successFunction);

    function successFunction(data) {
        var allRows = data.split(/\r?\n|\r/);
        for (var i = 0; i < allRows.length; i++) {
            var cells = allRows[i].split(',');
            var cell = new Array(cells.length);
            for (var j = 0; j < cells.length; j++) {
                cell[j] = cells[j];
            }
            csvData.push(cell);
        }
    }

    //删除最前面的两行数据
    csvData.splice(0, 2);
    return csvData;
}


//最大衰落
function maxFading(data,balance) {

    // var dataForCal = data;

    var minValue = data[0];
    var maxValue = data[0];
    var iMax = 0;
    var iMin = 0;

    var diff = [];

    var n = data.length;
    for (var i = 1; i < n; i++) {
        //如果产生了新的高点
        if (data[i] > maxValue) {
            //将最大值和最小值改为当前值
            maxValue = data[i];
            minValue = data[i];
            //将当前序号赋给最大值和最小值序号
            iMax = i;
            iMin = i;
            continue;
        }
        //如果产生了新的低点
        else if (data[i] < minValue) {
            //将当前值赋给最小值minValue变量
            minValue = data[i];
            //记录最小值序号
            iMin = i;
            //
            var tempDiff = new diffObject(maxValue, minValue, iMax, iMin);
            diff.push(tempDiff);
        }
    }

    /*取最大衰落的项*/
    var maxDrawDown = diff.reduce(function (prev, cur) {
        return prev.percentDown >= cur.percentDown ? prev : cur;
    });
    return maxDrawDown;

    function diffObject(maxValue, minValue, iMax, iMin) {
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.iMax = iMax;
        this.iMin = iMin;
        this.percentDown = Math.round(((maxValue - minValue) / (maxValue+balance)) * 100 * 100) / 100;
    }
}

//协方差
//计算方法：每个时刻的“X值与其均值之差”乘以“Y值与其均值之差”得到一个乘积，再对这每时刻的乘积求和并求出均值
function covariance(x, y) {

    //计算均值
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < x.length; i++) {
        sumX += x[i];
        sumY += y[i];
    }
    var averageX = sumX / x.length;
    var averageY = sumY / y.length;

    //
    var sumZ = 0;
    for (var j = 0; j < x.length; j++) {
        sumZ += ((x[j] - averageX) * (y[j] - averageY));
    }

    var covariance = sumZ / x.length;
    // console.log(covariance);
    return covariance;
}

//标准差
//计算方法：每一时刻变量值与变量均值之差再平方，求得一个数值，再将每一时刻这个数值相加后求平均，再开方
function STD(x) {
    var sumX = 0;
    for (var i = 0; i < x.length; i++) {
        sumX += x[i];
    }
    var averageX = sumX / x.length;
    var sumZ = 0;
    for (var i = 0; i < x.length; i++) {
        sumZ += (x[i] - averageX) * (x[i] - averageX);
    }
    var averageZ = sumZ / x.length;
    var STD = Math.sqrt(averageZ);
    return STD;
}

//相关系数
function correlation(x, y) {
    //判断数组长度是否一致
    if (!(x.length == y.length)) {
        return "数组长度不一致!";
    }
    var correlation = covariance(x, y) / (STD(x) * STD(y));

    //保留小数点后两位
    correlation = Math.floor(correlation * 100) / 100;
    return correlation;
}


//N日真实波动幅度
function ATR(csvData, days) {

    var trData = [];
    trData.push(csvData[0][2] - csvData[0][3]);
    for (var i = 1; i < csvData.length; i++) {
        var tempData = d3.max([csvData[i][2] - csvData[i][3],//最高价-最低价
            csvData[i][2] - csvData[i - 1][4],//最高价-昨日收盘价
            csvData[i - 1][4] - csvData[i][3]]);//昨日收盘价-最低价
        trData.push(tempData);
    }
    var sum = 0;
    for (var i = 0; i < days; i++) {
        sum = sum + trData[i];
    }
    var DN20 = Math.round((sum / days) * 100) / 100;

    var N20 = [];
    var PDN = 0;
    for (var i = days; i < trData.length; i++) {
        if (i == days) {
            PDN = DN20;
            N20.push(PDN);
            continue;
        }
        PDN = Math.round(((19 * PDN + trData[i]) / days) * 100) / 100;
        N20.push(PDN);
    }
    return N20;

}


//合并两个数组
function zip(array1, array2) {
    if (!(array1.length == array2.length)) return "数据长度不一致";
    var arrayCombine = [];
    for (var i = 0; i < array1.length; i++) {
        var arrayTemp = [];
        arrayTemp.push(array1[i]);
        arrayTemp.push(array2[i]);
        arrayCombine.push(arrayTemp);
    }
    return arrayCombine;
}

/*获取交易利润数组*/
function getPerTradeProfit(tradeData) {

    var profitPers = [];
    for (var i = 0; i < tradeData.length; i++) {

        var profitPer = 0;
        if (tradeData[i].direction.indexOf("empty") >= 0) {
            /*提取进场价格*/
            var indexArray = [];
            for (var j = 0; j < tradeData[i].preCode.length; j++) {
                var obj = tradeData[i].preCode.charAt(j);
                if (obj == "-") {
                    indexArray.push(j);
                }
            }
            var priceIn = tradeData[i].preCode.slice(indexArray[0] + 1, indexArray[1]);

            if (tradeData[i].direction.indexOf("long") >= 0) {
                /*多头平仓*/
                profitPer = (tradeData[i].price - priceIn) * tradeData[i].amount;
                profitPers.push(profitPer);

            } else if (tradeData[i].direction.indexOf("short") >= 0) {
                /*空头平仓*/
                profitPer = (priceIn - tradeData[i].price) * tradeData[i].amount;
                profitPers.push(profitPer);
            }

        }
    }
    return profitPers;
}

/*计算相关系数矩阵*/
function getCorrelationMatrix(arraysToCal) {

    var correlationMatrixMain = [];
    var n = arraysToCal.length;
    for (var i = 0; i < n; i++) {
        var obj1 = arraysToCal[i]
        var correlationMatrixCell = [];
        for (var j = 0; j < n; j++) {
            var obj2 = arraysToCal[j];
            var correlationShip = correlation(obj1, obj2);
            correlationMatrixCell.push(correlationShip);
        }
        correlationMatrixMain.push(correlationMatrixCell);
    }
    return correlationMatrixMain;
}


//净值曲线图 p86 ok
//月度回报分布图 p51
//月度回报图    p90
//最长衰落期 ok
//最大衰落  ok
//浮动回报
//浮动回报标准差
//实际交易回报 ok
//实际交易回报标准差
//R平方值
//平均复合增长率 CAGR
//滚动平均一年期回报率
//平均月度回报
//MAR比率  p94
//相关系数  ok
//相关系数矩阵 ok
//总交易次数  ok
//整体交易成功率  ok
//夏普比率
//稳健夏普比率
//RAR
//R立方
