/**
 * 入口：页面初始化的工作放到这个里面
 **/
$(function () {
    getAllSlidesJson();
});

window.direction = "vertical";//翻页方式
//初始化页面，获取页面json后执行 20160123 修改
function initPage() {
    //初始化swiper和动画
    switch (parseInt(window.slideType)) {
        case 1:
            initSwiper({ 'id': 'swiper-container' }); break;
        case 2:
            initSwiper({ 'id': 'swiper-container' }); break;
        case 3:
            initSwiperType3({ 'id': 'swiper-container' }); break;
        case 4:
            initSwiperType4({ 'id': 'swiper-container' }); break;
        default:
            initSwiper({ 'id': 'swiper-container' }); break;
    }    
    //背景音乐初始化
    initBgMusic();
    //视频按钮初始化20160123
    initVideoShow();
    //初始化表单20160123
    initForm();
}
/**
 * 初始化Swiper
 **/
var mySwiper;
function initSwiper(options) {
    var id = options.id;
    mySwiper = new Swiper('#' + id, {
        direction: window.direction,
        mousewheelControl: true,
        autoplay: window.autoPlay > 0 ? window.autoPlay : 0, // 20160123 自动播放
        autoplayDisableOnInteraction: false,                 // 20160123 自动播放
        onInit: function (swiper) {
            swiperAnimateCache(swiper); //隐藏动画元素 
            swiperAnimate(swiper); //初始化完成开始动画            
        },
        onSlideChangeEnd: function (swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画            
        },
        onTransitionEnd: function (swiper) {
        }
    });
}
//设置方向 20160123 修改
function setDirection(desc) {
    var direc = "vertical";
    if (desc == "1") {
        direc = "vertical";
    } else if (desc == "2") {
        direc = "horizontal";
    } else {
        direc = "slideType" + desc;
    }
    if (desc == "1" || desc == "3") {
        $("#array").show();
        $("#arrayR,#arrayL").hide();
    } else if (desc == "2" || desc == "4") {
        $("#array").hide();
        $("#arrayR,#arrayL").show();
    }
    window.direction = direc;
}

var type_effect = { 0: "none", 1: "bounce", 2: "flash", 3: "pulse", 4: "rubberBand", 5: "shake", 6: "swing", 7: "tada", 8: "wobble", 9: "bounceIn", 10: "bounceInLeft", 11: "bounceInRight", 12: "bounceInUp", 13: "bounceInDown", 14: "bounceOut", 15: "bounceOutLeft", 16: "bounceOutRight", 17: "bounceOutUp", 18: "bounceOutDown", 19: "fadeIn", 20: "fadeInLeft", 21: "fadeInRight", 22: "fadeInUp", 23: "fadeInDown", 24: "fadeOut", 25: "fadeOutDown", 26: "fadeOutLeft", 27: "fadeOutRight", 28: "fadeOutUp", 29: "slideInUp", 30: "slideInDown", 31: "slideInLeft", 32: "slideInRight", 33: "slideOutUp", 34: "slideOutDown", 35: "slideOutLeft", 36: "slideOutRight", 37: "flipInY", 38: "flipOutY", 39: "lightSpeedIn", 40: "lightSpeedOut", 41: "zoomIn", 42: "zoomOut", 43: "rotateIn", 44: "rotateOut" };

//********************************************************************
//       解析一个页面的json，返回解析后的html对象（对象很重要！！！）   该方法非常有用
//********************************************************************
function getSlideHtmlByJson(json) {
    if (!json) return;
    var bgColor = json.bgColor;
    var bgurl = json.bgUrl;
    var elements = !json.elements ? new Array() : json.elements; //20151017
    var slide = $('<div class="swiper-slide"></div>');
    var bg = $('<div class="page-background" bg-url="' + bgurl + '" style="background-image: url(' + bgurl + '); background-color:' + bgColor + ';"></div>');
    slide.append(bg);

    for (var i = 0; i < elements.length; i++) {
        slide.append(getBoxHtmlByJson(elements[i]));
    }
    return slide;
}
//获取一个元素的html对象
function getBoxHtmlByJson(json) {
    var id = json.id == "" ? new Date().getTime() : json.id;
    var ctype = parseInt(json.ctype);
    var ani = json.properties.ani;
    var css = json.css;
    var mid = json.mid;
    var content = json.content;

    var box = $('<div class="el-box" style="position: absolute;"></div>');   //20151025 旋转后动画bug 去掉ani
    var midBox = $('<div class="el-box-mid ani"></div>');                    //20151025 旋转后动画bug 增加ani
    var contentBox = $('<div id="' + id + '" class="el-box-contents" ctype="' + ctype + '"></div>');

    box.css({ left: css.left + "px", top: css.top + "px", width: css.width + "px", height: css.height + "px", "z-index": css.zIndex });
    if (parseInt(css.transform) > 0) {
        var value = "rotateZ(" + css.transform + "deg)";
        box[0].style.transform = value;
        box[0].style.webkitTransform = value; //20151215 兼容性修改，加上前缀 /* Safari 和 Chrome */
        box[0].style.mozTransform = value;    //20151215 兼容性修改，加上前缀 /* Firefox */
        box[0].style.msTransform = value;     //20151215 兼容性修改，加上前缀 /* IE 9 */
        box[0].style.oTransform = value;      //20151215 兼容性修改，加上前缀 /* Opera */
    }
    if (parseInt(ani.type) != 0) {
        midBox.attr('swiper-animate-effect', type_effect[ani.type]); //20151025 旋转后动画bug box替换为midBox
        midBox.attr('swiper-animate-duration', ani.duration + 's');  //20151025 旋转后动画bug box替换为midBox
        midBox.attr('swiper-animate-delay', ani.delay + 's');        //20151025 旋转后动画bug box替换为midBox
        midBox.attr('swiper-animate-count', ani.count);              //20151025 旋转后动画bug box替换为midBox
    }
    midBox = getMidHtmlByJson(mid, midBox);
    contentBox = getContentHtmlByJson(content, contentBox, ctype);
    midBox.html(contentBox);
    box.html(midBox);
    return box;
}
//获取mid层的html对象
function getMidHtmlByJson(json, mid) {
    var mid_css = json.css;
    if (mid_css.borderStyle != "none" && mid_css.borderWidth != "0") {
        mid.css({ "border-width": mid_css.borderWidth + "px", "border-style": mid_css.borderStyle, "border-color": mid_css.borderColor });
    }
    if (mid_css.opacity != "1") { mid.css("opacity", mid_css.opacity); }
    if (mid_css.borderRadius != 0) {
        mid.css("border-radius", mid_css.borderRadius + "px");  // 20151019 修改增加px
    }
    if (mid_css.boxShadow != 'none') {
        mid.css("box-shadow", mid_css.boxShadow);
    }
    mid.css("backgroundColor", mid_css.backgroundColor);
    mid.css("padding-top", mid_css.paddingTop + "px");
    return mid;
}
//获取content的html对象
function getContentHtmlByJson(json, contentBox, ctype) {
    if (ctype == 1) {//图片
        if (json.src)
            contentBox.html('<img src="' + json.src + '" style="width:100%;height:100%;" />')
        if (json.imgLink)//20160123 增加
            contentBox.append('<a href="' + json.imgLink + '" class="imgLink"></a>')
    }
    else if (ctype == 2) {//文字
        contentBox.html(json.contents);
        var css = json.css;
        contentBox.css({ "color": css.color, "font-size": css.fontSize });
        contentBox[0].style.lineHeight = css.lineHeight;
        if (css.textAlign != "start") {
            contentBox.css("text-align", css.textAlign);
        }
        if (css.fontFamily != '微软雅黑') {
            contentBox.css("font-family", css.fontFamily);
        }
    }
    else if (ctype == 3) {//视频 20160123 
        contentBox.append('<a class="video_btn" videoUrl="' + json.videoUrl + '"></a>');
    }
    else if (ctype == 501 || ctype == 502 || ctype == 503 || ctype == 504)//输入框 20160123增加
    {
        contentBox.append('<textarea maxlength="300" placeholder="' + json.placeholder + '" name="form-input"></textarea>');
    } else if (ctype == 6)//提交按钮 20160123增加
    {
        contentBox.append('<button class="form-submit">' + json.btnName + '</button>');
    }
    else if (ctype == 8)//拨号按钮 20160123增加
    {
        contentBox.append('<a class="tel-btn" href="tel:' + json.tel + '">' + json.btnName + '</a>');
    }
    return contentBox;
}

//获取整个场景所有页面的json
function getAllSlidesJson() {
    //以下代码放到ajax里面即可，json为返回的数据
    json = { "sceneId": "156413", "fengmian": "images/ad5.jpg", "title": "我是标题", "desc": "这里是描述", "category": "企业", "bgMsc": "./assets/mp3/3.mp3", "bgMscName": "泡沫.mp3", "slideType": "4", "whoSee": "所有人", "autoPlay": "0", "slides": [{ "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/a11.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "center", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字<br>我是新生成的文字<br>我是新生成的文字<br>我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/m4.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/m3.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/ad10.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "50", "height": "294", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/line2.png", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "1", "pageId": "5", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1457583136078", "ctype": "502", "properties": { "ani": { "type": "0", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "40", "left": "60", "top": "60", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "1", "borderStyle": "solid", "borderColor": "rgba(8, 161, 239, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(255, 255, 255, 1)", "paddingTop": "0" } }, "content": { "placeholder": "姓名" } }, { "id": "1457583136078", "ctype": "503", "properties": { "ani": { "type": "0", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "40", "left": "60", "top": "110", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "1", "borderStyle": "solid", "borderColor": "rgba(8, 161, 239, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(255, 255, 255, 1)", "paddingTop": "0" } }, "content": { "placeholder": "手机" } }, { "id": "1457583136078", "ctype": "504", "properties": { "ani": { "type": "0", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "40", "left": "60", "top": "160", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "1", "borderStyle": "solid", "borderColor": "rgba(8, 161, 239, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(255, 255, 255, 1)", "paddingTop": "0" } }, "content": { "placeholder": "邮箱" } }, { "id": "1457583143119", "ctype": "6", "properties": { "ani": { "type": "0", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "40", "left": "61", "top": "210", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "solid", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(255, 255, 255, 1)", "paddingTop": "0" } }, "content": { "btnName": "提交" } }, { "id": "1458107462526", "ctype": "8", "properties": { "ani": { "type": "0", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "100", "height": "30", "left": "110", "top": "350", "zIndex": "3", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "solid", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(246, 178, 35, 1)", "paddingTop": "0" } }, "content": { "btnName": "一键拨号", "tel": "01088886666" } }] } }] };

    var slides = json.slides;
    //var wrapper = $("#swiper-container div.swiper-wrapper").html("");
    var slideLast = $("#slide_last");
    var len = slides.length;
    for (var i = 0; i < len; i++) {
        var slideJson = slides[i].slide;
        slideLast.before(getSlideHtmlByJson(slideJson));
    }
    setDirection(json.slideType);           // 设置翻页方式
    //20160123 增加if
    window.slideType = json.slideType;
    if (json.slideType == '3' || json.slideType == '4') {
        $('head').append('<script src="js/slideType.pc.js"></script>');
    }
    $("#bgMusic").attr("src", json.bgMsc);  // 设置背景音乐
    window.autoPlay = parseInt(0 || json.autoPlay);  // 20160123 自动播放
    initPage();

}

