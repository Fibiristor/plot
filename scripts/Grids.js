/**
 * Created by fibiristor on 2018/8/13.
 */


function plotGrids(cellID, h, v) {

    var padding = {top: 30, right: 70, bottom: 30, left: 70};

    // var svgCell = document.getElementById(cellID).firstElementChild.firstChild;
    // if (svgCell == null) {
    //     console.info("no svg");
    // } else {
    //     var svg = d3.select(svgCell);
    //     var width = svgCell.clientWidth;
    //     var height = svgCell.clientHeight;
    // }

    var svgCell = document.getElementById(cellID).firstElementChild.firstChild;
    var svg = d3.select(svgCell);
    var width = svgCell.clientWidth;
    var height = svgCell.clientHeight;


    /*
     * [[[x1,y1],[x2,y2]],[[x1,y1],[x2,y2]],[[x1,y1],[x2,y2]]....]
     * */
    /*定义横向网格数据*/
    var horData = [];
    /*定义纵向网格数据*/
    var verData = [];

    /*初始化横向网格数组*/
    for (var x = 0; x < h; x++) {
        horData[x] = [];
        for (var y = 0; y < 2; y++) {
            horData[x][y] = [];
            for (var z = 0; z < 2; z++) {
                horData[x][y][z] = 0;
            }
        }
    }

    /*初始化纵向网格数组*/
    for (var x = 0; x < v; x++) {
        verData[x] = [];
        for (var y = 0; y < 2; y++) {
            verData[x][y] = [];
            for (var z = 0; z < 2; z++) {
                verData[x][y][z] = 0;
            }
        }
    }

    /*横向网格数组赋值*/
    for (var x = 0; x < h; x++) {
        for (var y = 0; y < 2; y++) {
            /*x*/
            horData[x][y][0] = y == 0 ? padding.left : (width - padding.right);
            /*y*/
            horData[x][y][1] = (x + 1) * ((height - padding.top - padding.bottom) / h) + padding.bottom;
        }
    }

    /*纵向网格数组赋值*/
    for (var x = 0; x < v; x++) {
        for (var y = 0; y < 2; y++) {
            /*x*/
            verData[x][y][0] = (x + 1) * ((width - padding.left - padding.right) / v) + padding.left;
            /*y*/
            verData[x][y][1] = y == 0 ? padding.top : (height - padding.bottom);
        }
    }

    //横向网格路径生成器
    var horPath = d3.svg.line();

    //绘制横向网格
    for (var i = 0; i < horData.length; i++) {
        svg.append("path")
            .attr("class","gridPath")
            .attr("d", horPath(horData[i]))
            .attr("stroke", "grey")
            .attr("stroke-width", "1px")
            .attr("fill", "none")
            .attr("stroke-dasharray", "3,3");
    }

    //纵向网格路径生成器
    var verPath = d3.svg.line();

    //绘制纵向网格
    for (var i = 0; i < verData.length; i++) {
        svg.append("path")
            .attr("class","gridPath")
            .attr("d", verPath(verData[i]))
            .attr("stroke", "grey")
            .attr("stroke-width", "1px")
            .attr("fill", "none")
            .attr("stroke-dasharray", "3,3");
    }

}