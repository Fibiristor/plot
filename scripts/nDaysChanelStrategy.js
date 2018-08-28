/**
 * Created by fibiristor on 2018/3/9.
 */
/*
 * csvData:品种数据
 * inDays:入场突破天数
 * outDays:退出突破天数
 * balance:初始资金
 * initStop:初始止损
 * */


/*！！！！还没有加入杠杆参数！！！！*/
function nDaysChanelStrategy(csvData, inDays, outDays, balance) {

    //初始止损
    var initStopToggle = true;
    var initStopParam = 2;

    var profit = 0;             //利润
    // var risk = 0.7;             //可控仓位上线
    // var numberOfEnter = 4;      //加仓次数

    var profitDate = [];
    var profitData = [];        //每日利润数组

    //N 波动性：真实波动幅度的20日指数移动平均值
    var ATRData = ATR(csvData, inDays);


    //N日最高价-------------------------------------------------------------

    function nDaysHigh(csvData, days) {
        //用于N日最高价的数组
        var maxValues = [];

        //初始化maxValue
        var maxValue = 0;

        //求N日最大值并放入数组maxValues
        var n = csvData.length;
        for (var i = 0; i < n; i++) {
            maxValue = csvData[i][2];
            //如果起始日期数小于N，取当前价格为最大值
            if (i <= days) {
                for (var j = 0; j < i; j++) {
                    if (csvData[j][2] > maxValue) {
                        maxValue = csvData[j][2];
                    }
                }

            } else {//日期数量大于N，取最高价
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
            //如果日期数量小于N,取当前价格为最低值
            if (i <= days) {
                for (var j = 0; j < i; j++) {
                    if (csvData[j][3] < minValue) {
                        minValue = csvData[j][3];
                    }
                }

            } else {//日期数量大于N，取最低价
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

    //--------------------------------------------------------------------

    var inDaysTopValues = nDaysHigh(csvData, inDays);  //多头入场 通道上轨

    var outDaysBottomValues = nDaysLow(csvData, outDays);//多头出场 通道下轨

    var inDaysBottomValues = nDaysLow(csvData, inDays);  //空头入场 通道下轨

    var outDaysTopValues = nDaysHigh(csvData, outDays);//空头出场 通道上轨


    //交易策略数据
    // {tradeDate: "2017/1/20", amount: 700, price: 3123, direction: "buy", code: 12345, preCode: 0}


    //交易数据数组
    var tradeData = [{
        "tradeDate": "",
        "price": 0,
        "direction": "",
        "amount": 0,
        "code": "",
        "preCode": ""
    }];


    //用于记录交易状态
    var positionStatus = {
        "position": "empty",
        "amount": 0,
        "code": "",
        "preCode": "",
        "balance": balance,
        "inPrice": 0
    };


    //从N日后一天开始计算
    // var n = csvData.length;
    for (var i = inDays + 1; i < csvData.length; i++) {

        // console.info("NO:"+ i +"  "+"date:"+ csvData[i][0] +"  "+"balance:" + positionStatus.balance);

        if (positionStatus.position == "empty") {      //空仓情况下

            profit += 0;
            profitDate.push(csvData[i][0]);
            profitData.push(profit);

            balance += 0;
            positionStatus.balance = balance;

            if (csvData[i][4] > inDaysTopValues[i - 1] || csvData[i][2] > inDaysTopValues[i - 1]) {  //收盘价>N日最高价,或者最高价>N日最高价

                // var codeTemp = csvData[i][0].concat("-").concat(csvData[i][4]).concat("-").concat("long");   //生成多头入场交易代码
                //
                // var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};
                //
                //
                // //记录交易数据
                // tradeTemp.tradeDate = csvData[i][0];                                            //入场日期
                // tradeTemp.price = parseFloat(csvData[i][4]);                                    //入场价格
                // tradeTemp.direction = "long";                                                   //入场方向
                // tradeTemp.amount = Math.round(positionStatus.balance * 0.01 / ATRData[i - inDays]);            //入场数量
                // tradeTemp.code = codeTemp;                                                      //入场交易编号
                // tradeTemp.preCode = "";
                //
                // tradeData.push(tradeTemp);   //将本次交易数据加入tradeData数组
                //
                // //修改交易状态
                // positionStatus.position = "long";                                               //持仓状态修改为多头
                // positionStatus.amount = tradeTemp.amount;                                       //记录持仓数量
                // positionStatus.code = codeTemp;                                                 //记录交易代码
                // positionStatus.preCode = "";                                                    //关联入场交易代码
                // positionStatus.inPrice = tradeTemp.price;                                       //多单入场价格
                //
                // profitDate.pop();
                // profitData.pop();
                //
                // //每日利润=(今日收盘价-入场价格)*持仓数量
                // var profitPer = (parseFloat(csvData[i][4]) - positionStatus.inPrice) * positionStatus.amount;
                // //利润合计
                // profit += profitPer;
                //
                // //记录利润数据
                // profitDate.push(csvData[i][0]);
                // profitData.push(profit);
                //
                // //可用资金=资金+每日利润
                // balance += profitPer;
                // positionStatus.balance = balance;
                intoMarket(csvData[i][0], csvData[i][4], "long", i); //多头入场

                continue;
            } else if (csvData[i][4] < inDaysBottomValues[i - 1] || csvData[i][3] < inDaysBottomValues[i - 1]) {   //收盘价低于n日最低价

                // var codeTemp = csvData[i][0].concat("-").concat(csvData[i][4]).concat("-").concat("short");   //生成空头入场交易代码
                //
                // var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};
                //
                //
                // //记录交易数据
                // tradeTemp.tradeDate = csvData[i][0];
                // tradeTemp.price = parseFloat(csvData[i][4]);
                // tradeTemp.direction = "short";
                // tradeTemp.amount = Math.round(positionStatus.balance * 0.01 / ATRData[i - inDays]);
                // tradeTemp.code = codeTemp;
                // tradeTemp.preCode = "";
                //
                // tradeData.push(tradeTemp);
                //
                // //记录交易状态
                // positionStatus.position = "short";               //持仓状态修改为空头
                // positionStatus.amount = tradeTemp.amount;        //记录持仓数量
                // positionStatus.code = codeTemp;                  //记录交易代码
                // positionStatus.preCode = "";                     //关联入场交易代码
                // positionStatus.inPrice = tradeTemp.price;        //空单入场价格
                //
                // profitDate.pop();
                // profitData.pop();
                //
                // //每日利润 = (入场价格-收盘价格)*持仓数量
                // var profitPer = (positionStatus.inPrice - parseFloat(csvData[i][4])) * positionStatus.amount;
                //
                // //利润合计
                // profit += profitPer;
                //
                // //记录利润数据
                // profitDate.push(csvData[i][0]);
                // profitData.push(profit);
                //
                // //可用资金=资金+每日利润
                // balance += profitPer;
                // positionStatus.balance = balance;
                intoMarket(csvData[i][0], csvData[i][4], "short", i); //空头入场

                continue;
            }
        } else if (positionStatus.position == "long") { //多头持仓情况

            //每日利润=(当日收盘价-昨日收盘价)*持仓数量
            var profitPer = (parseFloat(csvData[i][4]) - parseFloat(csvData[i - 1][4])) * positionStatus.amount;
            //合计利润
            profit += profitPer;
            profitDate.push(csvData[i][0]);
            profitData.push(profit);

            //资金=资金+每日利润
            balance += profitPer;
            positionStatus.balance = balance;

            //初始止损：多头仓位下，价格<（进场价格-N*ATR）
            if (initStopToggle) {

                if (csvData[i][4] < (positionStatus.inPrice - initStopParam * ATRData[i])) {
                    //平仓
                    stop(csvData[i][0], csvData[i][4], "long-empty", i);

                    continue;

                }
            }


            //加仓

            //跟踪止损：收盘价<N日最低价
            if (csvData[i][4] < outDaysBottomValues[i - 1]) {

                // var codeTemp = csvData[i][0].concat("-").concat(csvData[i][4]).concat("-").concat("long-empty");   //生成多头平仓交易代码
                // var preCodeTemp = positionStatus.code;              //取关联入场交易代码
                //
                //
                // //记录交易数据
                // var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};
                // tradeTemp.tradeDate = csvData[i][0];
                // tradeTemp.price = parseFloat(csvData[i][4]);
                // tradeTemp.direction = "long-empty";
                // tradeTemp.amount = positionStatus.amount;
                // tradeTemp.code = codeTemp;
                // tradeTemp.preCode = preCodeTemp;
                //
                // tradeData.push(tradeTemp);
                //
                // //修改持仓状态
                // positionStatus.position = "empty";               //持仓状态修改为空头
                // positionStatus.amount = 0;                    //记录持仓数量
                // positionStatus.code = codeTemp;                 //记录交易代码
                // positionStatus.preCode = preCodeTemp;           //关联入场交易代码
                //
                // profitDate.pop();
                // profitData.pop();
                // //平仓当日利润=(成交价格-前一日收盘价格)*持仓数量
                // var profitPer = (tradeTemp.price - parseFloat(csvData[i - 1][4])) * positionStatus.amount;
                //
                // //合计利润
                // profit += profitPer;
                //
                // //记录利润数据
                // profitDate.push(csvData[i][0]);
                // profitData.push(profit);
                //
                // //资金=资金+每日利润
                // balance += profitPer;
                // positionStatus.balance = balance;
                //平仓
                stop(csvData[i][0], csvData[i][4], "long-empty", i);

                continue;
            }
        } else if (positionStatus.position == "short") { //空头持仓情况
            var profitPer = (parseFloat(csvData[i - 1][4]) - parseFloat(csvData[i][4])) * positionStatus.amount;
            profit = profit + profitPer;
            profitDate.push(csvData[i][0]);
            profitData.push(profit);

            balance = balance + profitPer;
            positionStatus.balance = balance;

            //初始止损：空头仓位下，价格 >（进场价格+N*ATR）
            if (initStopToggle) {

                if (csvData[i][4] > (positionStatus.inPrice + initStopParam * ATRData[i])) {
                    //平仓操作
                    stop(csvData[i][0], csvData[i][4], "short-empty", i);

                    continue;
                }
            }

            //加仓

            //跟踪止损1:收盘价高于N * ATR

            //跟踪止损2:收盘价高于n日最高价
            if (csvData[i][4] > outDaysTopValues[i - 1]) {
                // var codeTemp = csvData[i][0].concat("-").concat(csvData[i][4]).concat("-").concat("short-empty");   //生成空头平仓交易代码
                // var preCodeTemp = positionStatus.code;              //取关联入场交易代码
                //
                // var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};
                // tradeTemp.tradeDate = csvData[i][0];
                // tradeTemp.price = parseFloat(csvData[i][4]);
                // tradeTemp.direction = "short-empty";
                // tradeTemp.amount = positionStatus.amount;
                // tradeTemp.code = codeTemp;
                // tradeTemp.preCode = preCodeTemp;
                //
                // tradeData.push(tradeTemp);
                //
                // positionStatus.position = "empty";               //持仓状态修改为空头
                // positionStatus.amount = 0;                    //记录持仓数量
                // positionStatus.code = codeTemp;                 //记录交易代码
                // positionStatus.preCode = preCodeTemp;           //关联入场交易代码
                //
                // profitDate.pop();
                // profitData.pop();
                //
                // var profitPer = (parseFloat(csvData[i - 1][4] - tradeTemp.price)) * positionStatus.amount;
                // profit = profit + profitPer;
                // profitDate.push(csvData[i][0]);
                // profitData.push(profit);
                //
                // balance = balance + profitPer;
                // positionStatus.balance = balance;

                stop(csvData[i][0], csvData[i][4], "short-empty", i);

                continue;
            }
        }

    }

    var profitWithDate = zip(profitDate, profitData);    //合并日期和利润数组
    tradeData.shift();                                  //删除tradeData第一行的样本数据
    return {"tradeData": tradeData, "profitData": profitWithDate};


    /*
     * tradeDate:入场日期
     * price:入场价格(收盘价)
     * direction:持仓方向
     * indexData:当前数据索引
     * */
    function intoMarket(tradeDate, price, direction, indexData) {
        var codeTemp = tradeDate.concat("-").concat(price).concat("-").concat(direction);   //生成入场交易代码

        var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};

        //记录交易数据
        tradeTemp.tradeDate = tradeDate;                                            //入场日期
        tradeTemp.price = parseFloat(price);                                    //入场价格
        tradeTemp.direction = direction;                                                   //入场方向
        tradeTemp.amount = Math.round((positionStatus.balance * 0.01) / ATRData[indexData - inDays]);            //入场数量
        tradeTemp.code = codeTemp;                                                      //入场交易编号
        tradeTemp.preCode = "";

        tradeData.push(tradeTemp);   //将本次交易数据加入tradeData数组

        //修改交易状态
        positionStatus.position = direction;                                               //修改持仓状态
        positionStatus.amount = tradeTemp.amount;                                       //记录持仓数量
        positionStatus.code = codeTemp;                                                 //记录交易代码
        positionStatus.preCode = "";                                                    //关联入场交易代码
        positionStatus.inPrice = tradeTemp.price;                                       //入场价格

        profitDate.pop();
        profitData.pop();

        //每日利润=(今日收盘价-入场价格)*持仓数量
        if (direction == "long") {
            var profitPer = (parseFloat(price) - positionStatus.inPrice) * positionStatus.amount;
        } else if (direction == "short") {
            var profitPer = (positionStatus.inPrice - parseFloat(price)) * positionStatus.amount;
        }
        //利润合计
        profit += profitPer;

        //记录利润数据
        profitDate.push(tradeDate);
        profitData.push(profit);

        //可用资金=资金+每日利润
        balance += profitPer;
        positionStatus.balance = balance;
    }


    /*
     * tradeDate:出场日期
     * price:出厂价格
     * direction:平仓类型
     * indexData:当前数据索引
     * */
    function stop(tradeDate, price, direction, indexData) {
        var codeTemp = tradeDate.concat("-").concat(price).concat("-").concat(direction);   //生成平仓交易代码
        var preCodeTemp = positionStatus.code;              //取关联入场交易代码


        //记录交易数据
        var tradeTemp = {"tradeDate": "", "price": 0, "direction": "", "amount": 0, "code": "", "preCode": ""};
        tradeTemp.tradeDate = tradeDate;
        tradeTemp.price = parseFloat(price);
        tradeTemp.direction = direction;
        tradeTemp.amount = positionStatus.amount;
        tradeTemp.code = codeTemp;
        tradeTemp.preCode = preCodeTemp;

        tradeData.push(tradeTemp);

        //修改持仓状态
        positionStatus.position = "empty";               //持仓状态修改为空头
        positionStatus.amount = 0;                    //记录持仓数量
        positionStatus.code = codeTemp;                 //记录交易代码
        positionStatus.preCode = preCodeTemp;           //关联入场交易代码

        profitDate.pop();
        profitData.pop();

        //平仓当日利润=(成交价格-前一日收盘价格)*持仓数量
        if (direction == "long-empty") {
            var profitPer = (tradeTemp.price - parseFloat(csvData[indexData - 1][4])) * positionStatus.amount; //(成交价格-前一日收盘价格)*持仓数量
        } else if (direction == "short-empty") {
            var profitPer = (parseFloat(csvData[indexData - 1][4] - tradeTemp.price)) * positionStatus.amount; //(前一日收盘价格-成交价格)*持仓数量
        }

        //合计利润
        profit += profitPer;

        //记录利润数据
        profitDate.push(tradeDate);
        profitData.push(profit);

        //资金=资金+每日利润
        balance += profitPer;
        positionStatus.balance = balance;

    }


}