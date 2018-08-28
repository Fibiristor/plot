/**
 * Created by fibiristor on 2018/7/31.
 */

var step = 20;
var shiftNumber = 0;
var minNumber = 200;
var previousIndex = 0;

var scrollFun = function (data) {

    console.info(data.length);

    /*阻止默认行为*/
    event.preventDefault();

    if (event.wheelDelta > 0) {
        shiftNumber = shiftNumber + step > data.length - minNumber ? data.length - minNumber : shiftNumber + step;
        console.info(data.length);
        // document.getElementById("tw").value = shiftNumber;
    } else {
        shiftNumber = shiftNumber - step <= minNumber ? minNumber : shiftNumber - step;
        // document.getElementById("tw").value = shiftNumber;
    }
    if (previousIndex != shiftNumber) {
        console.info(shiftNumber);
    }

    //do something...

    previousIndex = shiftNumber;
};

/*注册鼠标滚轮事件*/
// divForTest.addEventListener("mousewheel", scrollFun, false);
