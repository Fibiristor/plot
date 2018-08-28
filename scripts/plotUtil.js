/**
 * Created by fibiristor on 2018/3/17.
 */

/*............................k线部分............................*/
/*dataSourceFile:csv格式数据文件*/
/*cellId:用于放置candle的div容器id*/
/*默认id:candle*/
function plotCandle(cellId, csvData, beginIndex) {

    csvData = csvData.slice(beginIndex);

    /*获取放置candle的div容器*/
    var cell = document.getElementById(cellId);

    /*如果div容器为空，则创建一个div*/
    if (cell.firstElementChild == null) {
        var candle = document.createElement("div");
        /*如果div容器不为空，则先移除原来的div元素*/
    } else {
        cell.removeChild(cell.firstElementChild);
        /*再创建一个div容器元素*/
        var candle = document.createElement("div");
    }

    /*padding尺寸*/
    var padding = {top: 30, right: 70, bottom: 30, left: 70}

    //绘图区域尺寸设置
    /*宽*/
    var width = cell.offsetWidth;

    /*高*/
    var height = cell.offsetHeight;

    /*设置id名称*/
    candle.id = "candle";
    /*设置candle容器宽度*/
    candle.style.width = width + 'px';
    /*设置candle容器高度*/
    candle.style.height = height + 'px';

    /*设置背景色*/
    // candle.backgroundColor = "green";
    /*将创建的k线div容器作为子节点添加入父节点cell中*/
    cell.appendChild(candle);


    //从csvData中提取日期数据数组
    var tDate = [];
    for (var i = 0; i < csvData.length; i++) {
        tDate[i] = parseInt(new Date(csvData[i][0]).getTime());
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


    // var xScale = d3.scale.linear() //线性比例尺
    //     .domain(d3.extent(tDate))
    //     .rangeRound([0, width - padding.left - padding.right]);


    //y轴比例尺
    var yScale = d3.scale.linear()  //线性比例尺
        .domain([valueMin, valueMax])
        .rangeRound([0, height - padding.top - padding.bottom]);


    //添加svg对象
    var svg = d3.select(candle)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var rectStep = (xScale.range()[1] - padding.left - padding.right) / csvData.length;
    var rectWidth = 0.6 * rectStep;


    //最高价、最低价
    var candleLine = svg.selectAll("candleLine")
        .data(csvData)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return padding.left + xScale(tDate[i]) + xScale.rangeBand() / 2;
            // return padding.left + xScale(tDate[i] + rectWidth);
        })
        .attr("y1", function (d) {
            return height - padding.bottom - yScale(d[3]);  //low
        })
        .attr("x2", function (d, i) {
            return padding.left + xScale(tDate[i]) + xScale.rangeBand() / 2;
            // return padding.left + xScale(tDate[i] + rectWidth);
        })
        .attr("y2", function (d) {
            return height - padding.bottom - yScale(d[2]); //high
        })
        .attr("stroke", function (d) {
            return (d[1] - d[4] <= 0) ? "#ff4a68" : "#238853"; //根据开盘价和收盘价改变线条颜色
        })
        .attr("stroke-width", "1px")
        .attr("fill", "none");

    //开盘价、收盘价
    var candleBody = svg.selectAll("candleBody")
        .data(csvData)
        .enter()
        .append("rect")
        .attr("stroke", function (d) {
            return (d[1] - d[4] <= 0) ? "#ff4a68" : "#238853"
        })
        .attr("stroke-width", "0.3px")
        .attr("fill", function (d) {
            return (d[1] - d[4]) <= 0 ? "#ff4a68" : "#238853"
        })
        .attr("x", function (d, i) {
            return padding.left + xScale(tDate[i]);
        })
        .attr("y", function (d) {
            return height - padding.bottom - yScale(Math.max(d[1], d[4]));
        })
        .attr("width", xScale.rangeBand())
        // .attr("width", rectWidth + "px")
        .attr("height", function (d) {
//                return yScale(Math.abs(d[1] - d[4]));
            return Math.abs(yScale(d[1]) - yScale(d[4]));
        });


    //控制x轴输出密度的数组
    var indexNeed = [];
    var density = 20;
    /*缓存数组长度*/
    var tDate_length = tDate.length;
    for (var k = 0; k < tDate_length; k++) {
        if (k % (Math.round(tDate_length / density)) === 1) {
            indexNeed[k] = k;
        }
    }

    //清空数组中的空值
    /*缓存数组长度*/
    for (var i = 0; i < indexNeed.length; i++) {
        if (indexNeed[i] == "" || typeof(indexNeed[i]) == "undefined") {
            indexNeed.splice(i, 1);
            i = i - 1;
        }
    }

    //x轴坐标
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues(d3.permute(tDate, indexNeed))//tickValues直接输出坐标轴标志，permute函数根据indexNeed数组来决定tData数组的输出
        .tickFormat(function (d) {
            var format = d3.time.format('%Y/%m/%d');
            return format(new Date(d));
        })
        .orient("bottom");


    //翻转y轴定义域
    yScale.range([height - padding.top - padding.bottom, 0]);

    //y轴坐标
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    //在svg元素中添加g元素，并放置x坐标轴
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);

    //在svg元素中添加g元素，并放置y坐标轴
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis);

    /*******************************十字交叉线***********************************/
    var crossLine = svg.append("g")
        .attr("class", "focusLine")
        .style("display", "none");
    /*横线*/
    var vLine = crossLine.append("line");
    /*竖线*/
    var hLine = crossLine.append("line");


    /*******************************动态游标***********************************/
    /*x轴*/
    var xValueCursor = document.getElementById("xValue");
    /*设置绝对定位*/
    xValueCursor.style.position = "absolute";
    /*设置透明度为0.8*/
    xValueCursor.style.opacity = 0.8;

    /*y轴*/
    var yValueCursor = document.getElementById("yValue");
    /*设置绝对定位*/
    yValueCursor.style.position = "absolute";
    /*设置透明度为0.8*/
    yValueCursor.style.opacity = 0.8;

    /*******************************开、高、低、收的值***********************************/
    var openPrice = document.getElementById("openPrice");
    var highPrice = document.getElementById("highPrice");
    var lowPrice = document.getElementById("lowPrice");
    var closePRice = document.getElementById("closePrice");


    /*鼠标移动处理函数*/
    var mouseMoveFunc = function () {
        /*利用D3函数库获取鼠标当前位置*/
        var mouseX = d3.mouse(this)[0];
        var mouseY = d3.mouse(this)[1];

        /*根据鼠标移动改变横线的位置*/
        hLine.attr("x1", padding.left)
            .attr("y1", mouseY)
            .attr("x2", width - padding.right)
            .attr("y2", mouseY)
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .attr("stroke-dasharray", "3,3");

        /*根据鼠标移动改变竖线的位置*/
        vLine.attr("x1", mouseX)
            .attr("y1", height - padding.bottom)
            .attr("x2", mouseX)
            .attr("y2", 0 + padding.top)
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .attr("stroke-dasharray", "3,3");

        /*动态修改开、高、低、收的值*/
        openPrice.innerText = d3.mouse(this)[1];
        highPrice.innerText = d3.mouse(this)[0];
        lowPrice.innerText = d3.mouse(this)[1];
        closePRice.innerText = d3.mouse(this)[0];


        /*x轴动态游标*/
        /*******************************设置xValueCursor***********************************/
        /*左上角坐标*/
        xValueCursor.style.left = mouseX + (svg[0][0].getBoundingClientRect().left) + "px";
        xValueCursor.style.top = svg[0][0].clientHeight - 25 + "px"
        /*内容*/
        xValueCursor.innerText = mouseX;


        /*y轴动态游标*/
        /*******************************设置yValueCursor***********************************/
        /*左上角坐标*/
        yValueCursor.style.left = (svg[0][0].getBoundingClientRect().left) + padding.left + "px";
        yValueCursor.style.top = mouseY + "px";
        /*内容*/
        yValueCursor.innerText = (Math.round(yScale.invert(mouseY - padding.bottom - padding.top) * 100) / 100).toString();

    };

    /*监听鼠标移动事件-d3方法*/
    svg.on("mousemove", mouseMoveFunc)
        .on("mouseover", function () {
            crossLine.style("display", null);
            /*隐藏鼠标*/
            // this.style.cursor = "none";
        })
        .on("mouseout", function () {
            crossLine.style("display", "none");
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


/*............................volume部分............................*/
/*
 * svg:画图容器
 * date:横坐标日期数据
 * volume:纵坐标成交量数据
 * */
function plotVolumeByID(cellID, date, volumeData, beginIndex) {

    var date = date.slice(beginIndex);
    var volumeData = volumeData.slice(beginIndex);

    var cell = document.getElementById(cellID);

    if (cell.firstElementChild != null) {
        cell.removeChild(cell.firstElementChild);
        var volume = document.createElement("volume");
    } else {
        var volume = document.createElement("volume");
    }


    var width = cell.offsetWidth;

    var height = cell.offsetHeight;

    volume.style.width = width + 'px';

    volume.style.height = height + 'px';

    volume.id = "volume";

    cell.appendChild(volume);

    /*padding尺寸*/
    var padding = {top: 30, right: 70, bottom: 50, left: 70};

    //x轴坐标比例尺
    var xScale = d3.scale.ordinal()
    //      .domain(d3.range(date.length))
        .domain(date)
        .rangeBands([0, width - padding.left - padding.right], 0.2);

    //y轴坐标比例尺
    var yScale = d3.scale.linear()
        .domain(d3.extent(volumeData))
        .rangeRound([0, height - padding.top - padding.bottom]);

    var svg = d3.select(document.getElementById("volume"))
        .append("svg")
        .attr("width", width)
        .attr("height", height);

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
    var density = 20;
    var lengthTemp = date.length;
    for (var k = 0; k < lengthTemp; k++) {
        if (k % Math.round(lengthTemp / density) === 1) {
            indexNeed.push(k);
        }
    }
    var xAxis = d3.svg.axis()
        .scale(xScale)
        //                .tickSize(20)
        //.tickValues(d3.permute(d3.range(date.length), indexNeed))//tickValues直接输出坐标轴标志，permute函数根据indexNeed数组来决定tData数组的输出
        .tickValues(d3.permute(date, indexNeed))//tickValues直接输出坐标轴标志，permute函数根据indexNeed数组来决定tData数组的输出
        .orient("bottom");


    /*x轴*/
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);

    /*y轴*/
    yScale.rangeRound([height - padding.top - padding.bottom, 0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis);
}


//N日价格通道

function nDaysChannel(cellId, csvData, days, topColor, bottomColor, lineWidth, padding, beginIndex) {
    var csvData = csvData.slice(beginIndex);

    var svgCell = document.getElementById(cellId).firstElementChild.firstChild;
    var svg = d3.select(svgCell);
    var width = svgCell.clientWidth;
    var height = svgCell.clientHeight;

    //从csvData中提取日期数据数组
    var tDate = [];
    for (var i = 0; i < csvData.length; i++) {
        tDate[i] = csvData[i][0];
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

    //原始数据长度
    var lengthData = csvData.length;

    //定义日期数组
    var dateValues = [];

    //根据x轴比例尺重新计算dateValues数组
    for (var i = 0; i < csvData.length; i++) {
        dateValues.push(padding.left + xScale.rangeBand() * 0.5 + xScale(tDate[i]));
    }

    //N日最高价-------------------------------------------------------------

    //用于存放最大值的数组
    var maxValues = [];

    //初始化maxValue
    var maxValue = 0;

    //求N日最大值并放入数组maxValues
    for (var i = 0; i < lengthData; i++) {
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


/*............................利润曲线............................*/
function plotProfit(cellId, profitData, lineColor, beginIndex) {

    var profitData = profitData.slice(beginIndex);

    var container = document.getElementById(cellId);
    var svgCell;
    if (container.firstElementChild == null) {
        /*创建svg元素*/
        var svgPart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgPart.setAttribute("width", container.clientWidth.toString());
        svgPart.setAttribute("height", container.clientHeight.toString());
        svgCell = container.appendChild(svgPart);
    } else {
        svgCell = container.firstElementChild.firstChild;
    }

    var svg = d3.select(svgCell);
    var width = svgCell.clientWidth;
    var height = svgCell.clientHeight;
    var padding = {top: 30, right: 70, bottom: 30, left: 70};


    /*日期数据*/
    var pDate = [];
    /*利润数据*/
    var pData = [];

    for (var i = 0; i < profitData.length; i++) {
        pDate.push(profitData[i][0]);
        pData.push(profitData[i][1]);
    }

    /*利润最大值*/
    var pDataMax = d3.max(pData);

    //x轴比例尺(日期)
    var xScale = d3.scale.ordinal()  //序数比例尺
        .domain(pDate)
        .rangeBands([0, width - padding.left - padding.right], 0.2);

    /*y轴比例尺*/
    var yScaleProfit = d3.scale.linear()
        .domain([-1 * pDataMax, pDataMax])/*利润有可能为负值，所以输入域空间为-0.5Max~Max*/
        .rangeRound([height - padding.top - padding.bottom, 0]);


    /*根据比例尺计算绘图数据*/
    for (var i = 0; i < pData.length; i++) {
        pDate[i] = padding.left + xScale.rangeBand() * 0.5 + xScale(pDate[i]);
        pData[i] = padding.bottom + yScaleProfit(pData[i]);
    }

    /*合并日期和利润数据*/
    var pDataForDraw = d3.zip(pDate, pData);

    //利润路径生成器
    var pDataPathGen = d3.svg.line();

    //在svg中添加利润路径
    svg.append("path")
        .attr("d", pDataPathGen(pDataForDraw))
        .attr("stroke", lineColor)
        .attr("stroke-width", "1px")
        .attr("id", "profitPath")
        //            .attr("stroke-dasharray","1")//线型
        .attr("fill", "none");

//    var yAxisProfit = d3.svg.axis();

    //翻转y轴定义域
    // yScale.range([height - padding.top - padding.bottom, 0]);

    //y轴坐标
    var yAxisProfit = d3.svg.axis()
        .scale(yScaleProfit)
        .orient("right");

    //在svg元素中添加g元素，并放置y坐标轴
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (width - padding.right) + "," + padding.top + ")")
        .call(yAxisProfit);

}