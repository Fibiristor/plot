/**
 * Created by fibiristor on 2018/3/17.
 */

/*............................k线部分............................*/
/*dataSourceFile:csv格式数据文件*/
/*cellId:candle的div容器id*/
function plotCandle(cellId, dataSourceFile) {

    /*获取放置candle的div容器*/
    var cell = document.getElementById(cellId);
    /*创建一个div容器元素*/
    var candle = document.createElement("div");
    /*设置宽度*/
    candle.style.width =cell.offsetWidth+'px';
    /*设置高度*/
    candle.style.height =cell.offsetHeight+'px';

    /*设置id名称*/
    candle.id = "candle";

    /*设置背景色*/
    // candle.backgroundColor = "green";
    /*将创建的k线div容器作为子节点添加入父节点cell中*/
    cell.appendChild(candle);

    //获取交易品种原始数据(日期，开，高，低，收，成交量)
    var csvData = getDataFromCSV(dataSourceFile, 'text', false);

    //从csvData中提取日期数据数组
    var tDate = [];
    for (var i = 0; i < csvData.length; i++) {
        tDate[i] = csvData[i][0];
    }
    // for (var dateValue in tDate) {
    //     console.info(tDate[dateValue]);
    // }


    //绘图区域尺寸设置
    /*宽*/
    var width = document.getElementById("candle").offsetWidth;

    /*高*/
    var height = document.getElementById("candle").offsetHeight;
    // console.info(width,height);

    /*padding尺寸*/
    var padding = {top: 30, right: 30, bottom: 30, left: 30};


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

    //获取绘图区域的所有子元素
    // var cells = document.getElementById(cellId).childNodes;
    //获取第一个div元素
    // var candleCell = cells[0];
    var svg = d3.select(document.getElementById("candle"))
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    //      最高价、最低价
    var candleLine = svg.selectAll("candleLine")
        .data(csvData)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return padding.left + xScale(tDate[i]) + xScale.rangeBand() / 2;
        })
        .attr("y1", function (d) {
            return height - padding.bottom - yScale(d[3]);  //low
        })
        .attr("x2", function (d, i) {
            return padding.left + xScale(tDate[i]) + xScale.rangeBand() / 2;
        })
        .attr("y2", function (d) {
            return height - padding.bottom - yScale(d[2]); //high
        })
        .attr("stroke", function (d) {
            return (d[1] - d[4] <= 0) ? "red" : "green"; //根据开盘价和收盘价改变线条颜色
        })
        .attr("stroke-width", "1px")
        .attr("fill", "none");

    //      开盘价、收盘价
    var candleBody = svg.selectAll("candleBody")
        .data(csvData)
        .enter()
        .append("rect")
        .attr("stroke", function (d) {
            return (d[1] - d[4] <= 0) ? "red" : "green"
        })
        .attr("stroke-width", "0.3px")
        .attr("fill", function (d) {
            return (d[1] - d[4]) <= 0 ? "white" : "green"
        })
        .attr("x", function (d, i) {
            return padding.left + xScale(tDate[i]);
        })
        .attr("y", function (d) {
            return height - padding.bottom - yScale(Math.max(d[1], d[4]));
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function (d) {
//                return yScale(Math.abs(d[1] - d[4]));
            return Math.abs(yScale(d[1]) - yScale(d[4]));
        });


}

/*............................volume部分............................*/
/*
 * svg:画图容器
 * date:横坐标日期数据
 * volume:纵坐标成交量数据
 * */
function plotVolume(svg, date, volumeData) {

    var padding = {left: 70, right: 70, top: 20, bottom: 20};
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