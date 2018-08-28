/**
 * Created by fibiristor on 2018/3/7.
 */

function nDaysAveragePath(cellID, csvData, nDays, lineColor, padding,beginIndex) {

    var csvData = csvData.slice(beginIndex);

    var svgCell = document.getElementById(cellID).firstElementChild.firstChild;
    var svg = d3.select(svgCell);
    var width = svgCell.clientWidth;
    var height = svgCell.clientHeight;

    //从csvData中提取日期数据数组
    var tDate = [];
    for (var i = 0; i < csvData.length; i++) {
        tDate[i] = csvData[i][0];
    }

    //从csvData中提取收盘价数组
    var closeData = [];
    for (var i = 0; i < csvData.length; i++) {
        closeData[i] = csvData[i][4];
    }

    //获取每日最高价中的最大值
    var valueMax = d3.max(csvData, function (d) {
        return d[2];
    });


    //获取每日最低价中的最小值
    var valueMin = d3.min(csvData, function (d) {
        return d[3];
    });


    //x轴比例尺(日期)
    var xScale = d3.scale.ordinal()  //序数比例尺
        .domain(tDate)
        .rangeBands([0, width - padding.left - padding.right], 0.2);

    //y轴比例尺
    var yScale = d3.scale.linear()  //线性比例尺
        .domain([valueMin, valueMax])
        .rangeRound([0, height - padding.top - padding.bottom]);

    //翻转y轴定义域
    yScale.range([height - padding.top - padding.bottom, 0]);


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