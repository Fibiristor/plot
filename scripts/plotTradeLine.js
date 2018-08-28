/**
 * Created by fibiristor on 2018/8/10.
 */
function plotTradeLine(cellId, csvData, dataOfChanelStrategy, beginIndex) {

    csvData = csvData.slice(beginIndex);

    var tradeData = dataOfChanelStrategy.tradeData;

    var svgCell = document.getElementById(cellId).firstElementChild.firstElementChild;
    var svg = d3.select(svgCell);
    var width = svgCell.clientWidth;
    var height = svgCell.clientHeight;

    //绘图区域边框尺寸
    var padding = {top: 30, right: 70, bottom: 30, left: 70};

    var tDate = [];
    for (var i = 0; i < csvData.length; i++) {
        tDate[i] = csvData[i][0];
    }


    //获取最高价中的最大值
    var valueMax = d3.max(csvData, function (d) {
        return d[2];
    });

    //获取最低价中的最小值
    var valueMin = d3.min(csvData, function (d) {
        return d[3];
    });


    //candle部分x轴比例尺
    var xScale = d3.scale.ordinal()  //序数比例尺
        .domain(tDate)
        .rangeBands([0, width - padding.left - padding.right], 0.2);

    //candle部分y轴比例尺
    var yScale = d3.scale.linear()  //线性比例尺
        .domain([valueMin, valueMax])
        .rangeRound([0, height - padding.top - padding.bottom]);

    //交易连线数据
    var tradeArray = [];
    for (var i = 0; i < tradeData.length; i++) {
        //多头交易建仓单
        if (tradeData[i].direction == "long") {
            //多头建仓日期
            var buyDate = tradeData[i].tradeDate;
            //建仓价格
            var buyPrice = tradeData[i].price;
            //建仓编号
            var code = tradeData[i].code;
            //查找多头平仓数据（1:交易方向为long-empty;2:交易的predCode==code)
            for (var j = i + 1; j < tradeData.length; j++) {
                if (tradeData[j].direction == "long-empty" && tradeData[j].preCode == code) {
                    //平仓价格
                    var sellPrice = tradeData[j].price;
                    //平仓日期
                    var sellDate = tradeData[j].tradeDate;
                    //被平仓头寸编号
                    var preCode = tradeData[j].preCode;
                    //将一个完整的多头建仓-平仓数据存入数组
                    tradeArray.push({
                        buyPrice: buyPrice,
                        buyDate: buyDate,
                        code: code,
                        sellPrice: sellPrice,
                        sellDate: sellDate,
                        preCode: preCode
                    });
                    //一旦查找到配对成交数据，终止本次查询
                    break;
                }
            }
        }
        //空头交易建仓单
        if (tradeData[i].direction == "short") {
            //空头建仓日期
            var buyDate = tradeData[i].tradeDate;
            //空头建仓价格
            var buyPrice = tradeData[i].price;
            //建仓编号
            var code = tradeData[i].code;
            //查找空头平仓数据（1:交易方向short-empty;2:交易的preCode = code)
            for (var j = i + 1; j < tradeData.length; j++) {
                if (tradeData[j].direction == "short-empty" && tradeData[j].preCode == code) {
                    //平仓价格
                    var sellPrice = tradeData[j].price;
                    //平仓日期
                    var sellDate = tradeData[j].tradeDate;
                    //被平仓头寸编号
                    var preCode = tradeData[j].preCode;
                    //将一个完整的空头建仓-平仓数据存入数组
                    tradeArray.push({
                        buyPrice: buyPrice,
                        buyDate: buyDate,
                        code: code,
                        sellPrice: sellPrice,
                        sellDate: sellDate,
                        preCode: preCode
                    });
                    //一旦查找到配对成交数据，终止本次查询
                    break;
                }
            }

        }
        //如果是非建仓单据，则开始下一轮查询
        else if (tradeData[i].direction == "long-empty" || tradeData[i].direction == "short-empty") {
            continue;
        }
    }

    //声明用于存放交易连线的数组
    //[[[买日期,买价格],[卖日期,卖价格]],[[买日期,买价格],[卖日期,卖价格]],[[买日期,买价格],[卖日期,卖价格]]...]
    var lineArray = [];

    //初始化lineArray数组
    for (var x = 0; x < tradeArray.length; x++) {
        lineArray[x] = [];
        for (var y = 0; y < 2; y++) {
            lineArray[x][y] = [];
            for (var z = 0; z < 2; z++) {
                lineArray[x][y][z] = 0;
                lineArray[x][y][z] = 0;
            }
        }
    }


    //根据xScale和yScale将tradeArray数据转换并填充lineArray数组
    //padding,xScale,yScale;

    for (var i = 0; i < tradeArray.length; i++) {
        //建仓日期
        lineArray[i][0][0] = padding.left + xScale(tradeArray[i].buyDate) + xScale.rangeBand() * 0.5;
        //建仓价格
        lineArray[i][0][1] = height - padding.bottom - yScale(tradeArray[i].buyPrice);
        //平仓日期
        lineArray[i][1][0] = padding.left + xScale(tradeArray[i].sellDate) + xScale.rangeBand() * 0.5;
        //平仓价格
        lineArray[i][1][1] = height - padding.bottom - yScale(tradeArray[i].sellPrice);
    }

    //交易连线路径生成器
    var tradePath = d3.svg.line();

    //每笔交易的利润数组
    // var profit = [];
    //绘制交易连线
    for (var i = 0; i < lineArray.length; i++) {
        svg.append("path")
            .attr("d", tradePath(lineArray[i]))
            .attr("stroke", function () {
                //判断利润：多头：平仓>建仓:red 否则green;
                if (tradeArray[i].code.match(/long/)) {
                    // var temp = lineArray[i][0][1] - lineArray[i][1][1];
                    // profit.push(temp);
                    /*利用设置元素的自定义属性来绑定数据*/
                    this.setAttribute("buyDate", tradeArray[i].buyDate);
                    this.setAttribute("buyPrice", tradeArray[i].buyPrice);
                    this.setAttribute("sellDate", tradeArray[i].sellDate);
                    this.setAttribute("sellPrice", tradeArray[i].sellPrice);
                    return lineArray[i][0][1] > lineArray[i][1][1] ? "red" : "green";
                    //判断利润：空头：平仓<建仓:red 否则green;
                } else if (tradeArray[i].code.match(/short/)) {
                    // var temp = lineArray[i][1][1] - lineArray[i][0][1];
                    // profit.push(temp);
                    /*利用设置元素的自定义属性来绑定数据*/
                    this.setAttribute("buyDate", tradeArray[i].buyDate);
                    this.setAttribute("buyPrice", tradeArray[i].buyPrice);
                    this.setAttribute("sellDate", tradeArray[i].sellDate);
                    this.setAttribute("sellPrice", tradeArray[i].sellPrice);
                    return lineArray[i][0][1] > lineArray[i][1][1] ? "green" : "red";
                }
            })
            .attr("stroke-width", "2px")
            .attr("fill", "none")
            .on("mouseover", function () {
                console.info(this.getAttribute("buyDate") + "--" + this.getAttribute("buyPrice") + "--" + this.getAttribute("sellDate") + "--" + this.getAttribute("sellPrice"));
            });
    }

}