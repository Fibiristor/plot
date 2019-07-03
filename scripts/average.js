function nDaysAveragePath(cellID, sPP, csvData, nDays, lineColor, beginIndex) {

    var csvData = csvData.slice(beginIndex);

    var svgCell = document.getElementById(cellID).firstElementChild.firstChild;
    var svg = d3.select(svgCell);

    var width = sPP.width;
    var padding = sPP.padding;

    var tDate = sPP.tDate;

    //从csvData中提取收盘价数组
    var closeData = [];
    for (var i = 0; i < csvData.length; i++) {
        closeData[i] = csvData[i][4];
    }

    var xScale = sPP.xScale;
    var yScale = sPP.yScale;

    //收盘N日平均值数组
    var avgCloseData = avgData(closeData, nDays);

    //定义用于绘制的日期数组
    var dateValues = [];

    //根据x轴比例尺转换tDate数组
    for (var i = 0; i < csvData.length; i++) {
        dateValues.push(padding.left + xScale.rangeBand() * 0.5 + xScale(tDate[i]));
    }

    //根据y轴比例尺转换avgCloseData数组
    for (var i = 0; i < avgCloseData.length; i++) {
        avgCloseData[i] = padding.bottom + yScale(avgCloseData[i]);
    }

    //选取下标nDays以后的数据
    var dateValuesNDays = dateValues.slice(nDays);

    //合并数据
    var nDaysAvgData = d3.zip(dateValuesNDays, avgCloseData);


    //nDays收盘均价路径生成器
    var nDaysAvgDataPathGen = d3.svg.line()
        .interpolate("basis");
    /*插值方式：basis*/

    //在svg中添加N日收盘均价路径
    svg.append("path")
        .attr("d", nDaysAvgDataPathGen(nDaysAvgData))
        .attr("stroke", lineColor)
        .attr("stroke-width", "1px")
        .attr("stroke-dasharray", "2")//线型
        .attr("fill", "none");

    //算数平均函数
    function avgData(data, days) {
        var averages = [];
        for (var i = 0; i < data.length; i++) {
            if (i >= days) {
                var sum = 0;
                for (var j = i - days; j < i; j++) {
                    sum = sum + parseInt(data[j]);
                }
                var avg = sum / days;
                averages.push(avg);
            }
        }
        return averages;
    }

}