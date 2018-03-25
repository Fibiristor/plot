/**
 * Created by fibiristor on 2018/3/21.
 */
function showPic(whichpic) {
    //查询id为"placeholder"的元素是否存在
    if (!document.getElementById("placeholder")) return false;
    //获取当前a 标签的href属性
    var source = whichpic.getAttribute("href");
    //查询id为"placeholder"的元素
    var placeholder = document.getElementById("placeholder");
    //替换src属性的值
    placeholder.setAttribute("src", source);

    if (document.getElementById("description")) {
        var text = whichpic.getAttribute("title");
        var description = document.getElementById("description");
        description.firstChild.nodeValue = text;
    }
    return true;

}

function prepareGallery() {
//    检查当前浏览器是否理解getElementByTagName.
    if (!document.getElementsByTagName) {
        return false;
    }
//    检查当前浏览器是否理解getElementById.
    if (!document.getElementById) {
        return false;
    }

//    检查当前网页是否存在一个id为imagegallery的元素
    var gallery = document.getElementById("imagegallery");
    if (!gallery) {
        return false;
    }

//    遍历imagegallery元素中的所有链接。
    var links = gallery.getElementsByTagName("a");
//    设置onclick事件，让它在有关链接被点中是完成以下操作：
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function () {
//    1.把当前链接作为参数传递给showPic函数
            showPic(this);
//    2.取消链接被点击时的默认行为，不让浏览器打开这个链接。
            return false;
        };
    }
}
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof oldonload != "function") {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

addLoadEvent(prepareGallery);
