/**
 * Created by fibiristor on 2018/3/10.
 */
/*
* source:csv文件名称
* type:‘text’
* asy:false->同步  true->异步
* */
function getData(source,type,asy) {
    var csvData = [[1, 1, 1, 1, 1, 1]];//tradeDate,open,high,low,close,volume

    //ajax 同步获取csv数据
    $.ajax({
        url: source,
        dataType: type,
        async: asy
    }).done(successFunction);

    function successFunction(data) {
        var allRows = data.split(/\r?\n|\r/);
        for (var i = 0; i < allRows.length; i++) {
            var cells = allRows[i].split(',');
            var cell = new Array(cells.length);
            for (var j = 0; j < cells.length; j++) {
                cell[j] = cells[j];
            }
            csvData.push(cell);
        }
    }

    //删除最前面的两行数据
    csvData.splice(0, 2);
    return csvData;
}