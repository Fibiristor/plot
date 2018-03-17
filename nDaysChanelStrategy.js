/**
 * Created by fibiristor on 2018/3/9.
 */
function nDaysChanel() {

    var inDays = 20;            //入场

    var outDays = 10;           //出场

    var balance = 100000;  //初始资金

    var profit = 0;             //利润
    // var risk = 0.7;             //可控仓位上线
    // var numberOfEnter = 4;      //加仓数量

    var profitDate = [];
    var profitData = [];        //每日利润数组

    //candle原始数据
    var csvData = getData('candle.csv', 'text', false);

    //N 波动性：真实波动幅度的20日指数移动平均值
    var ATRData = ATR(csvData, inDays);


    //N日最高价-------------------------------------------------------------

    function nDaysHigh(csvData, days) {
        //用于存放最大值的数组
        var maxValues = [];

        //初始化maxValue
        var maxValue = 0;

        //求N日最大值并放入数组maxValues
        for (var i = 0; i < csvData.length; i++) {
            maxValue = csvData[i][2];
            //如果日期数量小于N
            if (i <= days) {
                for (var j = 0; j < i; j++) {
                    if (csvData[j][2] > maxValue) {
                        maxValue = csvData[j][2];
                    }
                }

            } else {//日期数量大于N
                for (var j = i - days; j < i; j++) {
                    if (csvData[j][2] > maxValue) {
                        maxValue = csvData[j][2];
                    }
                }
            }
            maxValues.push(maxValue);
        }
        return maxValues;
    }

    //N日最低价-------------------------------------------------------------

    function nDaysLow(csvData, days) {
        //用于存放N日最低价的数组
        var minValues = [];

        //初始化minValue
        var minValue = 0;

        //求N日最小值并放入数组minValues
        for (var i = 0; i < csvData.length; i++) {
            minValue = csvData[i][3];
            //如果日期数量小于N
            if (i <= days) {
                for (var j = 0; j < i; j++) {
                    if (csvData[j][3] < minValue) {
                        minValue = csvData[j][3];
                    }
                }

            } else {//日期数量大于N
                for (var j = i - days; j < i; j++) {
                    if (csvData[j][3] < minValue) {
                        minValue = csvData[j][3];
                    }
                }
            }
            minValues.push(minValue);

        }
        return minValues;
    }

    var inDaysTopValues = nDaysHigh(csvData, inDays);  //多头入场 通道上轨

    var outDaysBottomValues = nDaysLow(csvData, outDays);//多头出场 通道下轨

    var inDaysBottomValues = nDaysLow(csvData, inDays);  //空头入场 通道下轨

    var outDaysTopValues = nDaysHigh(csvData, outDays);//空头出场 通道上轨


    //交易策略数据
    // {tradeDate: "2017/1/20", amount: 700, price: 3123, direction: "buy", code: 12345, preCode: 0}

    var tradeData = [{
        "tradeDate": "",
        "price": 0,
        "direction": "",
        "amount": 0,
        "code": "",
        "preCode": ""
    }];   //交易数据数组

    var positionStatus = {
        "position": "empty",
        "amount": 0,
        "code": "",
        "preCode": "",
        "balance": balance,
        "inPrice": 0
    }; //用于记录交易状态

    for (var i = inDays + 1; i < csvData.length; i++) {
        if (positionStatus.position == "empty") {      //空仓情况下

            profit = profit + 0;
            profitDate.push(csvData[i][0]);
            profitData.push(profit);

            balance = balance + 0;
            positionStatus.balance = balance;

            if (csvData[i][4] > inDaysTopValues[i - 1] || csvData[i][2] > inDaysTopValues[i - 1]) {  //收盘价高于n日最高价 多头入场

                var codeTemp = csvData[i][0].concat("-").concat(csvData[i][4]).concat("-").concat("long");   //生成多头入场交易代码

                var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};

                tradeTemp.tradeDate = csvData[i][0];                                            //入场日期
                tradeTemp.price = parseFloat(csvData[i][4]);                                    //入场价格
                tradeTemp.direction = "long";                                                   //入场方向
                tradeTemp.amount = Math.round(positionStatus.balance * 0.01 / ATRData[i - inDays]);            //入场数量
                tradeTemp.code = codeTemp;                                                      //入场交易编号
                tradeTemp.preCode = "";

                tradeData.push(tradeTemp);   //将本次交易数据加入tradeData数组

                positionStatus.position = "long";                                               //持仓状态修改为多头
                positionStatus.amount = tradeTemp.amount;                                       //记录持仓数量
                positionStatus.code = codeTemp;                                                 //记录交易代码
                positionStatus.preCode = "";                                                    //关联入场交易代码
                positionStatus.inPrice = tradeTemp.price;                                       //多单入场价格

                profitDate.pop();
                profitData.pop();
                var profitPer = (parseFloat(csvData[i][4]) - positionStatus.inPrice) * positionStatus.amount;
                profit = profit + profitPer;
                profitDate.push(csvData[i][0]);
                profitData.push(profit);

                balance = balance + profitPer;
                positionStatus.balance = balance;

                continue;
            } else if (csvData[i][4] < inDaysBottomValues[i - 1] || csvData[i][3] < inDaysBottomValues[i - 1]) {   //收盘价低于n日最低价 空头入场

                var codeTemp = csvData[i][0].concat("-").concat(csvData[i][4]).concat("-").concat("short");   //生成空头入场交易代码

                var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};

                tradeTemp.tradeDate = csvData[i][0];
                tradeTemp.price = parseFloat(csvData[i][4]);
                tradeTemp.direction = "short";
                tradeTemp.amount = Math.round(positionStatus.balance * 0.01 / ATRData[i - inDays]);
                tradeTemp.code = codeTemp;
                tradeTemp.preCode = "";

                tradeData.push(tradeTemp);

                positionStatus.position = "short";               //持仓状态修改为空头
                positionStatus.amount = tradeTemp.amount;        //记录持仓数量
                positionStatus.code = codeTemp;                  //记录交易代码
                positionStatus.preCode = "";                     //关联入场交易代码
                positionStatus.inPrice = tradeTemp.price;        //空单入场价格

                profitDate.pop();
                profitData.pop();
                var profitPer = (positionStatus.inPrice - parseFloat(csvData[i][4])) * positionStatus.amount;
                profit = profit + profitPer;
                profitDate.push(csvData[i][0]);
                profitData.push(profit);

                balance = balance + profitPer;
                positionStatus.balance = balance;

                continue;
            }
        } else if (positionStatus.position == "long") { //多头持仓情况

            var profitPer = (parseFloat(csvData[i][4])- parseFloat(csvData[i-1][4]))*positionStatus.amount;
            profit = profit + profitPer;
            profitDate.push(csvData[i][0]);
            profitData.push(profit);

            balance = balance + profitPer;
            positionStatus.balance = balance;

            if (csvData[i][4] < outDaysBottomValues[i - 1]) {  //收盘价低于n日最低价

                var codeTemp = csvData[i][0].concat("-").concat(csvData[i][4]).concat("-").concat("long-empty");   //生成多头平仓交易代码
                var preCodeTemp = positionStatus.code;              //取关联入场交易代码

                var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};
                tradeTemp.tradeDate = csvData[i][0];
                tradeTemp.price = parseFloat(csvData[i][4]);
                tradeTemp.direction = "long-empty";
                tradeTemp.amount = positionStatus.amount;
                tradeTemp.code = codeTemp;
                tradeTemp.preCode = preCodeTemp;

                tradeData.push(tradeTemp);

                positionStatus.position = "empty";               //持仓状态修改为空头
                positionStatus.amount = 0;                    //记录持仓数量
                positionStatus.code = codeTemp;                 //记录交易代码
                positionStatus.preCode = preCodeTemp;           //关联入场交易代码

                profitDate.pop();
                profitData.pop();
                var profitPer = (tradeTemp.price - parseFloat(csvData[i-1][4]))*positionStatus.amount;
                profit = profit + profitPer;
                profitDate.push(csvData[i][0]);
                profitData.push(profit);

                balance = balance + profitPer;
                positionStatus.balance = balance;

                continue;
            }
        } else if (positionStatus.position == "short") { //空头持仓情况
            var profitPer = (parseFloat(csvData[i-1][4]) - parseFloat(csvData[i][4]))*positionStatus.amount;
            profit = profit + profitPer;
            profitDate.push(csvData[i][0]);
            profitData.push(profit);

            balance = balance + profitPer;
            positionStatus.balance = balance;

            if (csvData[i][4] > outDaysTopValues[i - 1]) {    //收盘价高于n日最高价
                var codeTemp = csvData[i][0].concat("-").concat(csvData[i][4]).concat("-").concat("short-empty");   //生成空头平仓交易代码
                var preCodeTemp = positionStatus.code;              //取关联入场交易代码

                var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};
                tradeTemp.tradeDate = csvData[i][0];
                tradeTemp.price = parseFloat(csvData[i][4]);
                tradeTemp.direction = "short-empty";
                tradeTemp.amount = positionStatus.amount;
                tradeTemp.code = codeTemp;
                tradeTemp.preCode = preCodeTemp;

                tradeData.push(tradeTemp);

                positionStatus.position = "empty";               //持仓状态修改为空头
                positionStatus.amount = 0;                    //记录持仓数量
                positionStatus.code = codeTemp;                 //记录交易代码
                positionStatus.preCode = preCodeTemp;           //关联入场交易代码

                profitDate.pop();
                profitData.pop();
                var profitPer = (parseFloat(csvData[i-1][4] - tradeTemp.price))*positionStatus.amount;
                profit = profit + profitPer;
                profitDate.push(csvData[i][0]);
                profitData.push(profit);

                balance = balance + profitPer;
                positionStatus.balance = balance;

                continue;
            }
        }

    }


    var profitData = d3.zip(profitDate, profitData);    //合并日期和利润数组

    tradeData.shift();                                  //删除tradeData第一行的样本数据

    return {"tradeData": tradeData, "profitData": profitData};

}