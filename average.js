/**
 * Created by fibiristor on 2018/3/7.
 */

//算数平均函数

function avgData(data, days) {
    var avgs = new Array();
    for (var i = 0; i < data.length; i++) {
        if (i >= days) {
            var sum = 0;
            for (var j = i - days; j < i; j++) {
                sum = sum + parseInt(data[j]);
            }
            var avg = sum / days;
            avgs.push(avg);
        }
    }
    return avgs;
}

function nDaysAveragePath(data,nDays,lineColor) {

    //定义日期数组
    var dateValues = new Array();

    //根据x轴比例尺重新计算dateValues数组
    for (var i = 0; i < data.length; i++) {
        dateValues.push(padding.left + xScale.rangeBand() * 0.5 + xScale(tDate[i]));
    }

    var closeData = new Array();
    //收盘价数组
    for (var i = 0; i < data.length; i++) {
        closeData[i] = data[i][4];
    }
    //收盘N日平均价数组
    var avgCloseData = avgData(closeData, nDays);


    //根据yScale转换
    for (var i = 0; i < avgCloseData.length; i++) {
        avgCloseData[i] = padding.bottom + yScale(avgCloseData[i]);
    }


    //选取下标10以后的数据
    var dateValuesNDays = dateValues.slice(nDays);

    //合并数据
    var nDaysAvgData = d3.zip(dateValuesNDays, avgCloseData);


    //nDays收盘均价路径生成器
    var nDaysAvgDataPathGen = d3.svg.line()
        .interpolate("basis");

    //在svg中添加N日收盘均价路径
    svg.append("path")
        .attr("d", nDaysAvgDataPathGen(nDaysAvgData))
        .attr("stroke", lineColor)
        .attr("stroke-width", "1px")
        .attr("stroke-dasharray","2")//线型
        .attr("fill", "none");

}