/**
 * Created by fibiristor on 2018/8/11.
 */

/*
* sampleFile:采样文件
* lengthOfSimulateData:需要生成的数据长度
* */
function getSimulateData(sampleFile, lengthOfSimulateData) {

    Date.prototype.Format = function () {
        var year = this.getFullYear();
        var month = this.getMonth() + 1;
        var day = this.getDate();
        var formatDate = year + "/" + month + "/" + day;
        return formatDate;
    }
//    获取样本数据
    var csvData = getDataFromCSV(sampleFile, "text", false);
//    计算高开低收的变化值
    var dValueForSimulateData = [];
    for (var i = 1; i < csvData.length; i++) {
        var tempData = [];
        /*开盘价差值*/
        tempData.push(parseFloat(csvData[i][1]) - parseFloat(csvData[i - 1][4]));
        /*最高价差值*/
        tempData.push(parseFloat(csvData[i][2]) - parseFloat(csvData[i - 1][4]));
        /*最低价差值*/
        tempData.push(parseFloat(csvData[i][3]) - parseFloat(csvData[i - 1][4]));
        /*收盘价差值*/
        tempData.push(parseFloat(csvData[i][4]) - parseFloat(csvData[i - 1][4]));
        /*成交量差值*/
        tempData.push(parseFloat(csvData[i][5]) - parseFloat(csvData[i - 1][5]));
        //将高开低收的变化值放入新数组
        dValueForSimulateData.push(tempData);
    }
//        console.info(dValueForSimulateData);

//样本数据的随机索引值
    var randomIndex = Math.floor(Math.random() * dValueForSimulateData.length);
//依据随机索引值抽取数据开始日期
    var beginDate = new Date(csvData[randomIndex][0]);
//初始化第一个k线
    var simulateData = [[beginDate.Format(), parseFloat(csvData[randomIndex][1]),
        parseFloat(csvData[randomIndex][2]),
        parseFloat(csvData[randomIndex][3]),
        parseFloat(csvData[randomIndex][4]),
        parseFloat(csvData[randomIndex][5])]];

//        console.info(simulateData);

//随机获取变化数组的数据产生新模拟k线数据
    for (var j = 1; j < lengthOfSimulateData; j++) {
        //产生随机数
        randomIndex = Math.floor(Math.random() * dValueForSimulateData.length);

        var randomDataTemp = [];
        beginDate.setDate(beginDate.getDate() + 1);

        randomDataTemp.push(beginDate.Format());
        randomDataTemp.push(simulateData[j - 1][4] + dValueForSimulateData[randomIndex][0]);
        randomDataTemp.push(simulateData[j - 1][4] + dValueForSimulateData[randomIndex][1]);
        randomDataTemp.push(simulateData[j - 1][4] + dValueForSimulateData[randomIndex][2]);
        randomDataTemp.push(simulateData[j - 1][4] + dValueForSimulateData[randomIndex][3]);
        randomDataTemp.push(Math.abs(simulateData[j - 1][5] + dValueForSimulateData[randomIndex][4]));

        simulateData.push(randomDataTemp);
    }
    // for (var i = 0; i < lengthOfSimulateData; i++) {
    //     console.info(simulateData[i][0] + "-" + simulateData[i][1] + "-" + simulateData[i][2] + "-" + simulateData[i][3] + "-" + simulateData[i][4], simulateData[i][5]);
    // }

    return simulateData;
}