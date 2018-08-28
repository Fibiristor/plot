/**
 * Created by fibiristor on 2018/3/6.
 */

//N日价格通道

function nDaysChannel(svg, data, tDate,days, xScale, yScale, topColor, bottomColor,lineWidth,padding) {
    //原始数据长度
    var lengthData = data.length;

    //定义日期数组
    var dateValues = new Array();

    //根据x轴比例尺重新计算dateValues数组
    for (var i = 0; i < data.length; i++) {
        dateValues.push(padding.left + xScale.rangeBand() * 0.5 + xScale(tDate[i]));
    }

    //N日最高价-------------------------------------------------------------

    //用于存放最大值的数组
    var maxValues = new Array();

    //初始化maxValue
    var maxValue = 0;

    //求N日最大值并放入数组maxValues
    for (var i = 0; i < lengthData; i++) {
        maxValue = data[i][2];
        //如果日期数量小于N
        if (i <= days) {
            for (var j = 0; j < i; j++) {
                if (data[j][2] > maxValue) {
                    maxValue = data[j][2];
                }
            }

        } else {//日期数量大于N
            for (var j = i - days; j < i; j++) {
                if (data[j][2] > maxValue) {
                    maxValue = data[j][2];
                }
            }
        }
        maxValues.push(maxValue);

    }

    //根据y轴比例尺重新计算maxValues数组
    for (var i = 0; i < maxValues.length; i++) {
        maxValues[i] = padding.bottom + yScale(maxValues[i]);
    }

    //合并日期数组和N日最高价数组
    var maxValuesPathData = d3.zip(dateValues, maxValues);

    //N日最高价路径生成器
    var maxValuesPath = d3.svg.line();

    //在svg中添加N日最高价路径
    svg.append("path")
        .attr("d", maxValuesPath(maxValuesPathData))
        .attr("stroke", topColor)
        .attr("stroke-width", lineWidth)
        //            .attr("stroke-dasharray","10,5,2,2,2,5")
        .attr("fill", "none");

    //N日最低价-------------------------------------------------------------

    //用于存放N日最低价的数组
    var minValues = new Array();

    //初始化minValue
    var minValue = 0;

    //求N日最小值并放入数组minValues
    for (var i = 0; i < lengthData; i++) {
        minValue = data[i][3];
        //如果日期数量小于N
        if (i <= days) {
            for (var j = 0; j < i; j++) {
                if (data[j][3] < minValue) {
                    minValue = data[j][3];
                }
            }

        } else {//日期数量大于N
            for (var j = i - days; j < i; j++) {
                if (data[j][3] < minValue) {
                    minValue = data[j][3];
                }
            }
        }
        minValues.push(minValue);

    }

    //根据y轴比例尺重新计算minValues数组
    for (var i = 0; i < minValues.length; i++) {
        minValues[i] = padding.bottom + yScale(minValues[i]);
    }

    //合并日期数组和N日最低价数组
    var minValuesPathData = d3.zip(dateValues, minValues);

    //N日最低价路径生成器
    var minValuesPath = d3.svg.line();

    //在svg中添加N日最低价路径
    svg.append("path")
        .attr("d", minValuesPath(minValuesPathData))
        .attr("stroke", bottomColor)
        .attr("stroke-width", lineWidth)
        //            .attr("stroke-dasharray","10,5,2,2,2,5")
        .attr("fill", "none");

}

