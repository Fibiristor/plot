/**
 * Created by fibiristor on 2018/4/7.
 */


//协方差
//计算方法：每个时刻的“X值与其均值之差”乘以“Y值与其均值之差”得到一个乘积，再对这每时刻的乘积求和并求出均值
function covariance(x, y) {

    //计算均值
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < x.length; i++) {
        sumX += x[i];
        sumY += y[i];
    }
    var averageX = sumX / x.length;
    var averageY = sumY / y.length;

    //
    var sumZ = 0;
    for (var j = 0; j < x.length; j++) {
        sumZ += ((x[j] - averageX) * (y[j] - averageY));
    }

    var covariance = sumZ / x.length;
    // console.log(covariance);
    return covariance;
}

//标准差
//计算方法：每一时刻变量值与变量均值之差再平方，求得一个数值，再将每一时刻这个数值相加后求平均，再开方
function STD(x) {
    var sumX = 0;
    for (var i = 0; i < x.length; i++) {
        sumX += x[i];
    }
    var averageX = sumX / x.length;
    var sumZ = 0;
    for (var i = 0; i < x.length; i++) {
        sumZ += (x[i] - averageX) * (x[i] - averageX);
    }
    var averageZ = sumZ / x.length;
    var STD = Math.sqrt(averageZ);
    // console.log(STD);
    return STD;
}

//相关系数
function correlation(x, y) {
    //判断数组长度是否一致
    if (!(x.length == y.length)) {
        console.log("数组长度不一致!")
        return false;
    }
    var correlation = covariance(x, y) / (STD(x) * STD(y));

    //保留小数点后两位
    correlation = Math.floor(correlation * 100) / 100;
    return correlation;
}
