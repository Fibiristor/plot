/**
 * Created by fibiristor on 2018/3/17.
 */
/*
 * svg:画图容器
 * date:横坐标日期数据
 * volume:纵坐标成交量数据
 * */
function plotVolume(svg, date, volume) {

    var padding = {left: 70, right: 20, top: 20, bottom: 20};
    //宽度
    var width = svg[0][0].clientWidth;
    //高度
    var height = svg[0][0].clientHeight;

    //x轴坐标比例尺
    var xScale = d3.scale.ordinal()
    //      .domain(d3.range(date.length))
        .domain(date)
        .rangeBands([0, width - padding.left - padding.right], 0.2);

    //y轴坐标比例尺
    var yScale = d3.scale.linear()
        .domain(d3.extent(volumeData))
        .rangeRound([0, height - padding.top - padding.bottom]);

    //画柱状图
    svg.selectAll("volume")
        .data(volumeData)
        .enter()
        .append("rect")
        .attr("fill", "steelblue")
        .attr("x", function (d, i) {
//                    return padding.left + xScale(i);
            return padding.left + xScale(date[i]);

        })
        .attr("y", function (d) {
            return height - padding.bottom - yScale(d);

        })
        .attr("width", function (d) {
            return xScale.rangeBand(d);

        })
        .attr("height", function (d) {
            return yScale(d);

        });

    //控制x轴输出密度的数组
    var indexNeed = [];
    var density = 50;
    for (var k = 0; k < date.length; k++) {
        if (k % density === 1) {
            indexNeed.push(k);
        }
    }
    var xAxis = d3.svg.axis()
        .scale(xScale)
        //                .tickSize(20)
        //.tickValues(d3.permute(d3.range(date.length), indexNeed))//tickValues直接输出坐标轴标志，permute函数根据indexNeed数组来决定tData数组的输出
        .tickValues(d3.permute(date, indexNeed))//tickValues直接输出坐标轴标志，permute函数根据indexNeed数组来决定tData数组的输出
        .orient("bottom");


    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);
    yScale.rangeRound([height - padding.top - padding.bottom, 0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis);
}