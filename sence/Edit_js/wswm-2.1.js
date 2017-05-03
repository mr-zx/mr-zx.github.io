
//页面加载完成执行的方法集
$(function () {
    try {
        initPage();
    } catch (e) {
        console.log(e.message);
    }
});
//全局变量
var NowSlide, NowBox, MidBox, Contents;
var Ctype;
var WinW, WinH;
var Phone;
var PhoneId = "phoneBox";
var PhoneBoxW = null, PhoneBoxH = null;
var aniStartState = [];
var jcropObj;
var jcropRatios = [0, 1 / 1, 4 / 3, 3 / 4, 2 / 3, 1.32, 1.98, 0];
var maxPageNum = 30;
var LvJingObj = "";
window.sceneId, window.pageId;
var downPosition, upPosition;//鼠标按下和抬起的位置（判断是否显示右键菜单） 20151215 增加右键菜单
document.oncontextmenu = function () { return false; }//右键默认菜单不显示  20151215 增加右键菜单
var copyData = "";
//==============================华丽分割线01====页面初始化操作  begin==============================
function initPage() {//20160123修改
    Phone = $("#" + PhoneId);
    phoneBoxW = Phone.width();
    phoneBoxH = Phone.height();
    getAllSlidesJson();
    //initEdit_left();//初始化左侧导航
    //initPhone();//初始化整个手机容器
    //bindKeyup();
    //clickBg();
    actionAfterDomReady();
}
//Dom加载完成后执行的一些操作集合 20160123增加
function actionAfterDomReady() {
    initCheckbox();
    bindRadioEventOfCrop();
    bindLvJingClick();
    beforeCloseWin();
    prettySelect();
    inputfocus();
    bindEvYangShi_Ani();
    initInputDialogRadio();
}

//关闭浏览器前的提示 新增方法 20151105
function beforeCloseWin() {
    $("body").attr("onbeforeunload", "return '请确认你的场景已保存';");
}
// 美化下拉列表 新增方法 20151105
function prettySelect() {
    $("select").each(function () {
        var id = $(this).attr("id");
        if (id) {
            if (id == "donghua")
                selectPretty(id, function (value) { setAniEffect(value) });
            else if (id == "fangxiang")
                selectPretty(id, function (value) { setAniDirection(value) });
            else if (id == "fontFamilyEdit")//20151123
                selectPretty(id, function (value) { changeStyle("font-family", value); });
            else if (id == "fontSizeEdit")//20151123
                selectPretty(id, function (value) { changeStyle("font-size", value); });
            else if (id == "fenlei")
                selectPretty(id, function (value) { autoSourceMy("#" + id, 'sourceMyImgList'); });
            else if (id == "fenlei2")
                selectPretty(id, function (value) { autoSourceMy("#" + id, 'sourceMyBgList'); });
            else if (id == "borderStyleEdit")
                selectPretty(id, function (value) { changeStyle("border-style", value); });
            else selectPretty(id, function (value) { });
        }
    });
    addDelGroupBtn();//20151215  增加删除分组的按钮
    //测试用 后期要加的时候放到select.my.js里
    $("ul.tag_options").hover(function () { },
        function () {
            $(this).fadeOut("100");
        });
}

//初始化整个手机容器
function initPhone() {
    Phone = $("#" + PhoneId);
    $("#" + PhoneId + " .el-box").each(function (i) {
        initElBox($(this));
    });
    playAnimateAll();
    clickPhoneBg();
    preventImgLink(); //20160123 增加
}
//初始化一个元素
function initElBox(elBox) {
    //初始化拖动
    initDrag(elBox, PhoneId);
    //绑定事件监听
    elBox.bind('mousedown', function (e) {
        try { window.event.stopPropagation(); } catch (ev) { e.stopPropagation(); }
        bindMousedown(e, $(this));//20151215
        //按下位置记录
        downPosition = [e.clientX, e.clientY];
    }).unbind('dblclick').bind('dblclick', function (e) {
        popMenu_Edit();
    }).unbind('mouseup').bind('mouseup', { elBox: $(this) }, bindMouseup);//20151215增加mouseup事件监听
}
//绑定鼠标按下事件
function bindMousedown(e, elBox) {
    if (elBox.hasClass("el-box-active") && $("#edit_style_ani").css('display') == 'block') return;
    //切换活动box的class标识
    $("#" + PhoneId + " .el-box-active").removeClass('el-box-active');
    elBox.addClass('el-box-active');
    //NowBox一直赋值为点击的元素
    NowBox = elBox;
    MidBox = NowBox.children('div.el-box-mid').first();
    Contents = MidBox.children('div.el-box-contents').first();
    Ctype = Contents.attr("ctype");

    //拖动改大小初始化
    elResize(elBox);
    //显示样式-动画操作面板
    if (e.button == 0 || !e.button) //20151215
        showYangShi_Ani(1);
    kbMove.obj = NowBox[0]; //20151215  键盘控制

    exitFontEdit();//20151215 增加
}
//键盘事件
function bindKeyup() {
    $(document).keyup(function (e) {
        if (e.keyCode == 46) { // delete键
            if (Contents.attr('contenteditable') == 'true') return;
            deleteBox();                                 //20151105
        }
    });
}
//绑定鼠标抬起 20151215 增加 右键菜单
function bindMouseup(e) {
    try {
        if (e.button == 2) {
            var x = e.clientX, y = e.clientY;
            upPosition = [x, y];
            var elBox = e.data.elBox;
            if (Math.abs(downPosition[0] - upPosition[0]) <= 2 && Math.abs(downPosition[1] - upPosition[1]) <= 2) {
                showPopMenu(x, y);
                elBox.bind('mousemove', { elBox: elBox }, hidePopMenu);
            }
            if ($("#edit_style_ani").css("display") == "block") {
                //if ($("#aniTab").css("display") == "none")
                changeYangShi_AniTab(1);
                bindYangShi_Ani();
            }
        }
    } catch (e) {
        console.log(e.message);
    }
}

//显示右键菜单 20151215 增加 右键菜单
function showPopMenu(left, top) {
    $("#popMenu").css({ 'left': (left + 10) + 'px', 'top': top + 'px' }).show();
    $("#popMenu li").show();
    if (Ctype != 1) { //20160123 增加
        $("#popMenu li.cut").hide();
        $("#popMenu li.link").hide();
    }
    if (copyData == "") $("#popMenu li.paste").hide();
    else $("#popMenu li.paste").show();

}
//隐藏右键菜单（鼠标移动超出菜单范围20时）20151215 增加 右键菜单
function hidePopMenu(e) {
    var x = e.clientX, y = e.clientY;
    var elBox = e.data.elBox;
    var popMenu = $("#popMenu");
    var l = popMenu.position().left, t = popMenu.position().top, w = popMenu.width(), h = popMenu.height();
    if (!(x >= (l - 20) && x <= (l + w + 20) && y >= t - 20 && y <= (t + h + 20))) {
        hidePopMenu200();
        elBox.unbind('mousemove', hidePopMenu);
    }
};
//隐藏右键菜单  20151215 增加 右键菜单
function hidePopMenu200() {
    $("#popMenu").fadeOut(200);
}
//删除当前元素 20151105 添加
function deleteBox() {
    if (NowBox) {
        NowBox.remove();
        hideYangShi_Ani();
        updateSlide();
        updateIndex();
    }
}
//点击背景时要做的处理  20151215 修改
function clickBg() {
    $(".Edit_main").unbind('mousedown').bind('mousedown', function () {
        hideRightPanels();
        removeResizeBars();
        $("#" + PhoneId + " .el-box-active").removeClass('el-box-active');
        exitFontEdit();//20151215 增加
    });
    $(".Edit_right,.Edit_left,.Edit_center").unbind('mousedown').bind('mousedown', function (e) {
        e.stopPropagation();
        exitFontEdit();//20151215 增加
    });
}
//点击手机背景图
function clickPhoneBg() {
    $("#" + PhoneId + " .page-background").unbind('click').click(function () {
        hideYangShi_Ani();
        removeResizeBars();
        $("#" + PhoneId + " .el-box-active").removeClass('el-box-active');
        exitFontEdit();//20151215 增加
    });
}
//==============================华丽分割线01====页面初始化操作  end==============================

//==============================华丽分割线02====元素拖动  begin==================================
//初始化某元素拖动
function initDrag(elBox, parrentId) {
    elBox.draggable({
        containment: ".Edit_main",  //20151215
        scroll: false,
        start: function () {
        },
        drag: function () { },
        stop: function () {
            updateSlide();
        }
    });
}
//禁用某元素拖动
function closeDrag(elBox) {
    elBox.draggable('disable');
}
//开启某元素拖动
function openDrag(elBox) {
    elBox.draggable('enable');
}
//==============================华丽分割线02====元素拖动  end====================================

//==============================华丽分割线03====拖动改宽高  begin================================
function elResize(jq) {
    $(".bar").remove();
    var l = $('<div class="bar" id="rLeft"> </div>');
    var u = $('<div class="bar" id="rUp"> </div>');
    var r = $('<div class="bar" id="rRight"> </div>');
    var d = $('<div class="bar" id="rDown"></div>');
    var lu = $('<div class="bar" id="rLeftUp"> </div>');
    var ld = $('<div class="bar" id="rLeftDown"> </div>');
    var ru = $('<div class="bar" id="rRightUp"> </div>');
    var rd = $('<div class="bar" id="rRightDown"> </div>');
    var lineL = $('<div class="bar" id="lLeft"></div>');
    var lineR = $('<div class="bar" id="lRight"></div>');
    var lineU = $('<div class="bar" id="lUp"></div>');
    var lineD = $('<div class="bar" id="lDown"></div>');
    //Phone.children(".el-box").css("border", "none");
    //NowBox.css("border", "2px dashed #15D0FE");

    NowBox.append(lineU).append(lineR).append(lineD).append(lineL);
    //if (Ctype == 3) return;//（视频不可修改按钮大小）
    var o = new Resize(NowBox[0]);
    if (Ctype == 2 || Ctype == 501 || Ctype == 502 || Ctype == 503 || Ctype == 504 || Ctype == 6 || Ctype == 8) {
        NowBox.append(l).append(u).append(r).append(d);
        o.set($('#rUp')[0], 'up').set($('#rDown')[0], 'down').set($('#rLeft')[0], 'left').set($('#rRight')[0], 'right');
    }
    NowBox.append(lu).append(ld).append(ru).append(rd);
    o.set($('#rLeftUp')[0], 'leftUp').set($('#rLeftDown')[0], 'leftDown').set($('#rRightDown')[0], 'rightDown').set($('#rRightUp')[0], 'rightUp');
    //$(".bar").bind('mousedown', function () { hideBtnToolBar(); });
}
function removeResizeBars() {
    $(".bar").remove();
}
var Sys = (function (ua) {
    var s = {};
    s.IE = ua.match(/msie ([\d.]+)/) ? true : false;
    s.Firefox = ua.match(/firefox\/([\d.]+)/) ? true : false;
    s.Chrome = ua.match(/chrome\/([\d.]+)/) ? true : false;
    s.IE6 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6)) ? true : false;
    s.IE7 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7)) ? true : false;
    s.IE8 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8)) ? true : false;
    return s;
})(navigator.userAgent.toLowerCase());
var Css = function (e, o) {
    for (var i in o)
        e.style[i] = o[i];
};

var Extend = function (destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
};

var Bind = function (object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function () {
        return fun.apply(object, args);
    }
};

var BindAsEventListener = function (object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function (event) {
        event.stopPropagation();
        return fun.apply(object, [event || window.event].concat(args));
    }
};

var CurrentStyle = function (element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
};

function addListener(element, e, fn) {
    element.addEventListener ? element.addEventListener(e, fn, false) : element.attachEvent("on" + e, fn);
};
function removeListener(element, e, fn) {
    element.removeEventListener ? element.removeEventListener(e, fn, false) : element.detachEvent("on" + e, fn)
};

var Class = function (properties) {
    var _class = function () { return (arguments[0] !== null && this.initialize && typeof (this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this; };
    _class.prototype = properties;
    return _class;
};

var getmouseX = function (e) {
    return e.clientX - document.getElementById("phoneBox").getBoundingClientRect().left;
}
var getmouseY = function (e) {
    return e.clientY - document.getElementById("phoneBox").getBoundingClientRect().top;
}

var Resize = new Class({
    initialize: function (obj) {
        this.obj = obj;
        this.resizeelm = null;
        this.fun = null; //记录触发什么事件的索引
        this.original = []; //记录开始状态的数组
        this.width = null;
        this.height = null;
        this.w_h = null;
        this.fR = BindAsEventListener(this, this.resize);
        this.fS = Bind(this, this.stop);
        this.minSise = 1;//最小的尺寸   //20151020 修改最小尺寸
    },
    set: function (elm, direction) {
        if (!elm) return;
        this.resizeelm = elm;
        addListener(this.resizeelm, 'mousedown', BindAsEventListener(this, this.start, this[direction]));
        return this;
    },
    start: function (e, fun) {
        this.fun = fun;
        this.original = [parseFloat(CurrentStyle(this.obj).width), parseFloat(CurrentStyle(this.obj).height), parseFloat(CurrentStyle(this.obj).left), parseFloat(CurrentStyle(this.obj).top)];
        this.width = (this.original[2] || 0) + this.original[0];
        this.height = (this.original[3] || 0) + this.original[1];
        addListener(document, "mousemove", this.fR);
        addListener(document, 'mouseup', this.fS);
        this.w_h = this.original[0] / this.original[1];
    },
    resize: function (e) {
        this.fun(e);
        Sys.IE ? (this.resizeelm.onlosecapture = function () { this.fS() }) : (this.resizeelm.onblur = function () { this.fS() })
    },
    stop: function () {
        removeListener(document, "mousemove", this.fR);
        removeListener(document, "mousemove", this.fS);
        //window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        stopResize();
    },
    up: function (e) {
        // if (getmouseY(e) <= 0) return;                                                                          // 20151215 注释掉
        if (parseFloat(this.height - getmouseY(e)) > this.minSise) {   //20151020 修改最小尺寸  30改为this.minSise
            Css(this.obj, { top: getmouseY(e) + "px", height: this.height - getmouseY(e) + "px" });
            afterResize();
        }
    },
    down: function (e) {
        // if (getmouseY(e) >= phoneBoxH) return;                                                                  // 20151215 注释掉
        if (getmouseY(e) - this.original[3] > this.minSise) {   //20151020 修改最小尺寸  30改为this.minSise
            Css(this.obj, { top: this.original[3] + 'px', height: getmouseY(e) - this.original[3] + 'px' })
            afterResize();
        }
    },
    left: function (e) {
        // if (getmouseX(e) + 1 <= 0) return;                                                                     // 20151215 注释掉
        if (this.width - getmouseX(e) > this.minSise) {   //20151020 修改最小尺寸  30改为this.minSise
            Css(this.obj, { left: getmouseX(e) + 'px', width: this.width - getmouseX(e) + "px" });
            afterResize();
        }
    },
    right: function (e) {
        //if (getmouseX(e) >= phoneBoxW) return;                                                                  // 20151215 注释掉
        if (getmouseX(e) - this.original[2] > this.minSise) {   //20151020 修改最小尺寸  30改为this.minSise
            Css(this.obj, { left: this.original[2] + 'px', width: getmouseX(e) - this.original[2] + "px" });
            afterResize();
        }
    },
    leftUp: function (e) {
        var h = this.height - getmouseY(e);
        var w = h * this.w_h;
        var l = this.width - w;
        var t = getmouseY(e);
        //if (l + 1 <= 0 || t + 1 <= 0) return;                                                                   // 20151215 注释掉
        if (h > this.minSise) {   //20151020 修改最小尺寸  30改为this.minSise
            Css(this.obj, { left: l + "px", top: t + 'px', width: w + "px", height: h + "px" });
            afterResize();
        }
    },
    leftDown: function (e) {
        if (getmouseY(e) - this.original[3] > this.minSise) {   //20151020 修改最小尺寸  30改为this.minSise
            var h = getmouseY(e) - this.original[3];
            var w = h * this.w_h;
            var l = this.original[2] - (w - this.original[0]);
            var t = this.original[3];
            // if (l + 1 <= 0 || t + h > phoneBoxH) return; //20151123 修改托动不满 去掉等号                       // 20151215 注释掉
            Css(this.obj, { left: l + 'px', top: this.original[3] + 'px', width: w + 'px', height: h + 'px' })
            afterResize();
        }
    },
    rightUp: function (e) {
        var t = this.original[3] - (this.height - getmouseY(e) - this.original[1]);
        var h = this.height - getmouseY(e);
        var w = h * this.w_h;
        //if (t + 1 <= 0 || w + this.original[2] >= phoneBoxW) return;                                              // 20151215 注释掉
        if (parseFloat(this.height - getmouseY(e)) > this.minSise) {   //20151020 修改最小尺寸  30改为this.minSise
            Css(this.obj, { top: t + "px", height: h + 'px', width: w + "px" });
            afterResize();
        }
    },
    rightDown: function (e) {
        var w = getmouseX(e) - this.original[2];
        var h = w / this.w_h;
        //if (getmouseX(e) > phoneBoxW || this.original[3] + h > phoneBoxH) return;//20151123 修改托动不满 去掉等号  // 20151215 注释掉
        if (getmouseX(e) - this.original[2] > this.minSise) {   //20151020 修改最小尺寸  30改为this.minSise  
            Css(this.obj, { height: h + 'px', width: w + "px" });
            afterResize();
        }
    },
    turnDown: function (e) {
        Css(this.obj, { top: this.height + 'px', height: getmouseY(e) - this.height + 'px' });
    },
    turnUp: function (e) {
        Css(this.obj, { top: getmouseY(e) + 'px', height: this.original[3] - getmouseY(e) + 'px' });
    },
    turnRight: function (e) {
        Css(this.obj, { left: this.width + 'px', width: getmouseX(e) - this.width + 'px' });
    },
    turnLeft: function (e) {
        Css(this.obj, { left: getmouseX(e) + 'px', width: this.original[2] - getmouseX(e) + 'px' });
    }
});
//改变大小后处理方法
function afterResize() {
    //if (Ctype == 1) {
    //    updateImgSize();
    //}
    //else if (Ctype == 4) {
    //    var jqObj = NowBox.find(".fluxSlider");
    //    resizeFlux(jqObj);
    //}   
}
//改变大小停止后回调
function stopResize() {
    updateSlide();
}
//==============================华丽分割线03====拖动改宽高  end==============================

//==============================华丽分割线04====弹窗  begin==================================
function showDialogById(id, actionType) {
    var o = $('#' + id);
    var wh = $(window).height();
    var dh = $(document).height();
    var oh = o.height();
    var mh = Math.max((oh + 120), dh);
    var mask = "<div id='dialogMask' style='position:absolute;left:0px;top:0px;z-index:9999;width:100%;height:" + mh + "px;background-color:rgba(0,0,0,.5);display:none;'></div>";
    if (!$('#dialogMask')[0]) $('body').append(mask);
    mask = $('#dialogMask');
    mask.fadeIn(300).append(o);
    o.css('opacity', '0').show();
    o.stop().animate({
        'opacity': '1', 'margin-top': '60px'//20151105
    }, 300);
    mask.click(function () { closeDialogAndMask(id) });
    o.click(function (e) { e.stopPropagation(); });
    initDialog(id);
}
function closeDialogAndMask(dialogId) {
    var o = $('#' + dialogId), mask = $('#dialogMask');
    o.stop().animate({
        'opacity': '0', 'margin-top': '0px'
    }, 300, function () {
        o.hide().appendTo($('body'));
    });
    mask.fadeOut(300);
    afterClose(dialogId);
}
//不同的对话框id，需要在弹出后做不同的初始化操作
function initDialog(id) {
    if (id == 'xxxxx') {

    }
}
//关闭弹窗后的处理
function afterClose(id) {
    if (id == "changemusic") mscDiaClose();
}
//显示顶部的提示，如：保存成功
function showTopTip(msg, time) {
    var h = '<div id="topTip" class="topTip"></div>';
    if (!$("#topTip")[0])
        $('body').append(h);
    var o = $('#topTip').html(msg);
    var opacity0 = 2000;
    if (time) {
        opacity0 = time;
    }
    o.show(0).stop().animate({ 'opacity': '1' }, 200, function () {
        o.delay(500).animate({ 'opacity': '0' }, opacity0, function () { o.hide(); })
    });
}
//==============================华丽分割线04====弹窗  end====================================

//==============================华丽分割线05====裁剪工具（勿改）  begin======================
//开启裁剪
function openCrop(imgSrc) {
    var cropCon = $("#radiolist td.l");//---------------这里是放裁剪区域的容器---------------
    if (jcropObj) jcropObj.destroy();
    var img = $('<img id="cropbox" src="" style="width: 100%;height:100%" />');
    $("#jcropCon").html(img).appendTo(cropCon);
    $("#jcropCon").after($("#cropInfo"));

    $("#cropbox").attr('src', imgSrc);
    //以下设置图片居中
    var cw = cropCon.width(), ch = cropCon.height();
    var iw, ih;
    getImageSize(imgSrc, function (w, h) {
        jcropRatios[0] = w / h;
        iw = w, ih = h;
        var jh, jw, marginL, marginT;
        if (iw <= cw && ih <= ch) {
            jw = iw, jh = ih;
        } else {
            if ((iw / ih) >= (cw / ch))
                jw = cw, jh = jw / (iw / ih);
            else
                jh = ch, jw = jh * (iw / ih);
        }
        marginL = jw / 2;
        marginT = jh / 2;
        $("#jcropCon").css({ "width": jw, "height": jh, "margin-left": -marginL, "margin-top": -marginT });
        //初始化裁剪
        jcropObj = new JcropImg();
    });
}
//裁剪页单选事件绑定
function bindRadioEventOfCrop() {
    //裁剪--锁定比例复选框
    $('#lockRatio').hcheckbox(function (checked) {
        if (checked) {
            $("input[name=cropSize]").last().next("label")[0].click();
            jcropObj.lockRatio();
        } else {
            jcropObj.setRatio(0);
        }
    });
    //裁剪--比例单选框
    $('#radiolist').hradio(function (val) {
        var index = val;
        jcropObj.setRatio(jcropRatios[index]);
        if (index != 7) {
            $("#lockRatio")[0].checked = false;
            $("#lockRatio").next("label").removeClass('hCheckbox_checked');
        }
    });
}
//获取图片的原始宽高
function getImageSize(url, callback) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
        callback(img.width, img.height);
    } else {
        img.onload = function () {
            callback(img.width, img.height);
        }
    }
}
//定义裁剪工具对象
function JcropImg() {
    var obj = $("#cropbox");
    var realSize = { 'w': '0', 'h': '0' };//图片真实尺寸
    var jcrop_api;
    var init = function () {
        setRealSize();
        //创建裁剪
        obj.Jcrop({
            allowSelect: false,
            aspectRatio: (realSize.w / realSize.h),
            minSize: [5, 5],
            touchSupport: true,
            handleSize: 5,
            bgOpacity: 0.5,
            bgColor: '#fff',
            //addClass: 'jcrop-light',
            onSelect: updateCoords
        }, function () {
            jcrop_api = this;
            var imgW = jcrop_api.getWidgetSize()[0];
            var imgH = jcrop_api.getWidgetSize()[1];
            var c = { x: 0, y: 0, w: imgW, h: imgH }
            jcrop_api.setSelect([c.x, c.y, c.w, c.h]);
            updateCoords(c);
        });
    }
    var updateCoords = function (c) {
        var w1 = realSize.w;
        var w2 = jcrop_api.getBounds()[0];
        var scl1 = parseFloat(w1 / w2);
        var h1 = realSize.h;
        var h2 = jcrop_api.getBounds()[1];
        var scl2 = parseFloat(h1 / h2);
        $('#x').val(c.x * scl1);
        $('#y').val(c.y * scl2);
        $('#w').val(c.w * scl1);
        $('#h').val(c.h * scl2);
        $('#src').val($("#cropbox").attr('src'));
    };

    var setRealSize = function () {
        var img = new Image();
        img.src = obj.attr("src");
        if (img.complete) {
            realSize = { 'w': img.width, 'h': img.height };
        } else {
            img.onload = function () {
                realSize = { 'w': img.width, 'h': img.height };
            }
        }
    }
    this.setRatio = function (ratio) {
        jcrop_api.setOptions({ aspectRatio: ratio });
        jcrop_api.setSelect(getArea(ratio));
    }
    this.lockRatio = function () {
        var size = jcrop_api.tellScaled();
        var ratio = size.w / size.h;
        jcrop_api.setOptions({ aspectRatio: ratio });
    }
    this.destroy = function () {
        if (jcrop_api) jcrop_api.destroy();
    }
    var getArea = function (ratio) {
        var dim = jcrop_api.getBounds();
        var w = dim[0];
        var h = dim[1];
        if ((dim[0] / dim[1]) > ratio) {
            h = dim[1], w = h * ratio;
        } else {
            w = dim[0], h = w / ratio;
        }
        if (ratio == 0) {
            var size = jcrop_api.tellScaled();
            w = size.w, h = size.h;
        }
        return [0, 0, w, h];
    };
    //初始化
    init();
}
//==============================华丽分割线05====裁剪  end====================================

//==============================华丽分割线06====添加文字  begin==============================
function addWordsToScene() {
    var id = new Date().getTime();
    // 20151105 修改层级关系z-index
    var elBox = $('<div class="el-box" style="width:240px;height:38px;position:absolute;left:40px;top:100px;z-index:' + (getMaxZIndex() + 1) + ';"></div>');
    var d = $('<div class="el-box-mid ani"></div>');
    //20151105 修改该行
    var cts = $('<div id=' + id + ' class="el-box-contents" ctype="2" style="line-height:1.5;color:#676767;font-size:16px;text-align:center;">请在右侧编辑区修改文字内容</div>');
    Phone.append(elBox);
    elBox.append(d);
    d.append(cts);
    initElBox(elBox);
    elBox.trigger('mousedown');
    updateSlide();
}
//==============================华丽分割线06====添加文字  end====================================

//==============================华丽分割线07====添加、替换图片  begin============================
function addImgToScene(src) {
    var realWidth, realHeight;//真实的宽高
    var tarW = 180, tarH;
    $("<img/>").attr("src", src).load(function () {
        realWidth = this.width;
        realHeight = this.height;
        tarH = (realHeight / realWidth) * tarW;
        var id = new Date().getTime();
        // 20151105 修改层级关系z-index
        var elBox = $('<div class="el-box" style="width: ' + tarW + 'px; height: ' + tarH + 'px; position: absolute; left: 60px; top: 20px; z-index:' + (getMaxZIndex() + 1) + ';"></div>')
        var d = $('<div class="el-box-mid ani"></div>');
        var cts = $('<div id="' + id + '" class="el-box-contents" ctype="1"></div>');
        var img = $('<img src="' + src + '" style="width:100%;height:100%;" />');
        Phone.append(elBox);
        elBox.append(d);
        d.append(cts);
        cts.append(img);
        initElBox(elBox);
        elBox.trigger('mousedown');
        updateSlide();
    });
}

//添加图片的弹窗
function showImgAddDialog() {
    $("#myTab4 h1").text("添加图片");
    showDialogById("changeimg", "addImg");
    bindImgSelect();
    bindConfirmImg(0);
}
//替换图片的弹窗
function showImgReplaceDialog() {
    $("#myTab4 h1").text("更换图片");
    showDialogById("changeimg", "replaceImg");
    bindImgSelect();
    bindConfirmImg(1)
}
//替换封面图片的弹窗
function showFMReplaceDialog() {
    $("#myTab4 h1").text("更换封面");
    showDialogById("changeimg", "replaceFMImg");
    bindImgSelect();
    bindConfirmImg(2)
}
//关闭图片库弹窗
function hideImgDialog() {
    closeDialogAndMask('changeimg');
    cancelSelectImg();
    tcManageImg();
}
//点击选中图片（每次tab切换后要执行一遍）
function bindImgSelect() {
    $("#changeimg ul.imglist>li").unbind('click').bind('click', function () {
        cancelSelectImg();
        $(this).addClass("cur");
    });
}
//移除选中效果
function cancelSelectImg() {
    $("#changeimg ul.imglist>li.cur").removeClass("cur");
}
//替换图片
function replaceImg(src) {
    var img = Contents.children('img');
    img.attr('src', src);
    updateSlide();
}
//替换封面图片   20151015
function replaceFMImg(src) {
    var img = $("<img src='" + src + "'>");
    img.load(function () {
        var iw = img[0].width;
        var ih = img[0].height;
        var iRatio = parseFloat(iw / ih).toFixed(2);
        var ratio = parseFloat(118 / 169).toFixed(2);
        if (iRatio == ratio) {//比例合适，直接应用
            $("#fengMian").attr('src', src);
        } else {//比例不合适，需要裁剪            
            showFMImgCutDialog(src);
        }
    });
}
//绑定确认选中事件
function bindConfirmImg(type) {
    $("#changeimg .content .qrxz").unbind('click').bind('click', function () {
        confirmSelImg(type);
    });
}
//确定选中图片
function confirmSelImg(type) {
    var img = $("#changeimg ul.imglist>li.cur img");
    if (!img[0]) {
        showTopTip("没有选中的图片哦~");
        return;
    }
    var src = img.attr("data-src");
    if (type == 0)
        addImgToScene(src);
    else if (type == 1) {
        replaceImg(src);
        setLvJingObj();
    }
    else if (type == 2)
        replaceFMImg(src);
    hideImgDialog();
}
//显示新建分组弹窗
function showXjfz() {
    $("#changeimg div.newtc").fadeIn(100);
}
//隐藏新建分组弹窗
function hideXjfz() {
    $("#changeimg div.newtc").fadeOut(100);
}
//管理图片
function manageImg() {
    var text = $("#manageImg").text().trim();
    var lis = $("#myTab4_Content1 ul.imglist>li");
    if (text == "管理图片") {
        $("#manageImg").text("退出管理");
        $("#myTab4_Content1 div.qrxz").hide();
        $("#myTab4_Content1 div.newj").hide();
        $("#myTab4_Content1 div.delpic").removeClass('el_hide').unbind('click').bind('click', deleteMyImg);
        lis.children("h2").remove();
        lis.append("<h2></h2>");
        lis.each(function (i) {
            var li = $(this);
            li.unbind('click', manageSelect).bind('click', { "li": li }, manageSelect);
        });

    } else {
        tcManageImg();
    }
}
//退出管理图片
function tcManageImg() {
    $("#manageImg").text("管理图片");
    var lis = $("#myTab4_Content1 ul.imglist>li");
    lis.children("h2").remove();
    $("#myTab4_Content1 div.qrxz").show();
    $("#myTab4_Content1 div.newj").show();
    $("#myTab4_Content1 div.delpic").addClass('el_hide');
    sourceMyImgButton($("#fenlei").val());
}
//管理图片--选中
function manageSelect(param) {
    var li = param.data.li;
    var h2 = li.children("h2");
    h2.toggleClass("cur");
}

//给指定的下拉列表的li添加删除按钮(type:1 图片，2 背景) 20151215 增加
function addDelGroupBtnToLi(type, li) {
    if (li.find("div.delGroup")[0]) return;
    var del = $('<div class="delGroup" onclick="delSelfGroup(' + type + ',this)"></div>');
    li.append(del);
    li.unbind("mouseover").unbind("mouseout");
    li.mouseover(function () { del.show(); }).mouseout(function () { del.hide(); });
}
//增加删除分组的按钮 20151215 增加
function addDelGroupBtn() {
    //“我的图片”
    $("#select_fenlei li").each(function (index) {
        if (index == 0) return;
        addDelGroupBtnToLi(1, $(this));
    });
    //“我的背景”
    $("#select_fenlei2 li").each(function (index) {
        if (index == 0) return;
        addDelGroupBtnToLi(2, $(this));
    });
    $("#select_fenlei ul, #select_fenlei2 ul").append('<div class="clear"></div>');
}
//删除自定义分组(type:1 图片，2 背景;_this:点击的按钮) 20151215 增加
function delSelfGroup(type, _this) {
    try { window.event.stopPropagation(); }
    catch (e) { }
    var li = $(_this).parents("li").first();
    //弹出确认删除提示窗    
    var tc = $("#infotc_del_4");
    tc.css('opacity', '0').show().stop().animate({ 'opacity': '1', 'margin-top': '60px' }, 300);
    tc.find("div.close").unbind('click').bind('click', function () {
        tc.stop().animate({ 'opacity': '0', 'margin-top': '0px' }, 300, function () { tc.hide(); });
    });
    tc.find("div.qrxx").unbind('click').bind('click', function () {
        tc.find("div.close")[0].click();
        doDelSelfGroup(type, li);
    });
}

//==============================华丽分割线07====添加、替换图片  end================================

//==============================华丽分割线08====背景图操作  begin==================================

function showEditBg() {
    hideRightPanels();
    $("#edit_bg").fadeIn();
    var bgColor = rgbToRgba($("#" + PhoneId + " .page-background").css("background-color"));
    setBgColor(bgColor);
}
function hideEditBg() {
    $("#edit_bg").hide();
}

//设置slide背景色
function setBgColor(color) {
    var o = $("#slideBgColorEdit");
    var model = o.attr('model');
    o.css('background-color', color).attr('data-color', color);
    var input = o.siblings('div.r').first().children('input');
    input.val(color);
    ColorSelect.init(o, function (value) {
        //改变颜色值之后的处理
        o.css('background', value);
        input.val(value);
        $("#" + PhoneId + " .page-background").css("background-color", value)
    });
}
//清除背景样式
function clearBgStyle() {
    var bgColor = "rgba(255,255,255,1)";
    $("#" + PhoneId + " .page-background").css("background-color", bgColor)
    setBgColor(bgColor);
}
//添加背景图片的弹窗
function showBgImgAddDialog() {
    $("#myTab5 h1").text("添加背景");
    showDialogById("changebg", "addBgImg")
}
//替换背景图片的弹窗
function showBgImgReplaceDialog() {
    $("#myTab5 h1").text("更换背景");
    showDialogById("changebg", "replaceBgImg");
    bindBgImgSelect();
    bindConfirmBgImg("replaceBgImg");
}
//关闭图片库弹窗
function hideBgImgDialog() {
    closeDialogAndMask('changebg');
    cancelSelectBgImg();
}
//点击选中图片（每次tab切换后要执行一遍）
function bindBgImgSelect() {
    $("#changebg ul.imglist>li").unbind('click').bind('click', function () {
        cancelSelectBgImg();
        $(this).addClass("cur");
    });
}
//移除选中效果
function cancelSelectBgImg() {
    $("#changebg ul.imglist>li.cur").removeClass("cur");
}
//绑定确认选中事件
function bindConfirmBgImg(type) {
    $("#changebg .qrxz").unbind('click').bind('click', function () {
        confirmSelBgImg(type);
    });
}
//确定选中图片
function confirmSelBgImg(type) {
    var img = $("#changebg ul.imglist>li.cur img");
    if (!img[0]) {
        showTopTip("没有选中的图片哦~");
        return;
    }
    var src = img.attr("data-src");
    if (type == "addBgImg")
        changeSceneBg(src);
    else if (type == "replaceBgImg")
        changeSceneBg(src);
    hideBgImgDialog();
}
//替换背景图 20151015
function changeSceneBg(url) {
    $("#phoneBox .page-background").css({ 'background-image': 'url(' + url + ')' }).attr('bg-url', url);
    closeDialogAndMask('bgImgLib');
    updateSlide();
}
//删除背景图 20151015
function deleteSceneBg() {
    $("#phoneBox .page-background").css({ 'background-image': '' }).attr('bg-url', '');
}


//显示新建分组弹窗
function showBgXjfz() {
    $("#changebg div.newtc").fadeIn(100);
}
//隐藏新建分组弹窗
function hideBgXjfz() {
    $("#changebg div.newtc").fadeOut(100);
}

//管理背景
function manageBg() {
    var text = $("#manageBg").text().trim();
    var lis = $("#myTab5_Content1 ul.imglist>li");
    if (text == "管理背景") {
        $("#manageBg").text("退出管理");
        $("#myTab5_Content1 div.qrxz").hide();
        $("#myTab5_Content1 div.newj").hide();
        $("#myTab5_Content1 div.delpic").removeClass('el_hide').unbind('click').bind('click', deleteMyBg);
        lis.children("h2").remove();
        lis.append("<h2></h2>");
        lis.each(function (i) {
            var li = $(this);
            li.unbind('click', manageBgSelect).bind('click', { "li": li }, manageBgSelect);
        });

    } else {
        tcManageBg();
    }
}
//退出管理背景
function tcManageBg() {
    $("#manageBg").text("管理背景");
    var lis = $("#myTab5_Content1 ul.imglist>li");
    lis.children("h2").remove();
    $("#myTab5_Content1 div.qrxz").show();
    $("#myTab5_Content1 div.newj").show();
    $("#myTab5_Content1 div.delpic").addClass('el_hide');
    sourceMyBgButton($("#fenlei2").val());
}
//管理图片--选中
function manageBgSelect(param) {
    var li = param.data.li;
    var h2 = li.children("h2");
    h2.toggleClass("cur");
}
//设置背景图效果 20160123 新增方法
function setBgEffect(type) {
    var effectArr = ['', 'zoomUp', 'zoomDown'];
    var bgObj = Phone.find("div.page-background");
    for (var i = 1; i < effectArr.length; i++) {
        bgObj.removeClass(effectArr[i]);
    }
    if (type != 0)
        bgObj.addClass(effectArr[type]);
}

//==============================华丽分割线08====背景图操作  end==================================

//==============================华丽分割线09====背景音乐  begin==================================
function showEditMusic() {
    hideRightPanels();
    $("#edit_music").fadeIn();
    var src = $("#stPlayer").attr('src');
    var name = $("#stPlayer").attr('data-name');
    $("#edit_music .input4").val(name);
    var btn = $("#edit_music input.imginput1");
    if (!src) btn.val("添加音乐"); else btn.val("更换音乐");
    btn.unbind('click').bind('click', function () {
        if (!src) {
            showMscAddDialog();
        } else {
            showMscReplaceDialog();
        }
    });
}
//隐藏音乐操作面板
function hideEditMusic() {
    $("#edit_music").hide();
}
//添加背景音乐的弹窗
function showMscAddDialog() {
    $("#myTab7 h1").text("添加音乐");
    showDialogById("changemusic", "addMsc");
    bindMscTrCick();
    bindClickPlay();
}
//替换背景音乐的弹窗
function showMscReplaceDialog() {
    $("#myTab7 h1").text("更换音乐");
    showDialogById("changemusic", "replaceMsc");
    //选中已经选择的音乐
    var mscId = $("#mscId").val();
    $("#mscId_" + mscId).parent().parent().click();
    bindMscTrCick();
    //bindClickPlay();//20151015 修改
}
//关闭背景音乐库弹窗
function hideMscDialog() {
    closeDialogAndMask('changemusic');
}
//关闭弹窗后
function mscDiaClose() {
    mscPause();
    var c = $("#changemusic input[name=r]:checked")[0];
    if (c) {
        c.checked = false;
        $(" #changemusic table tr td img.playing").attr('src', templatestyle + '/Edit_img/music_p.png');
    }
}
//点击音乐列表行 20151015 修改
function bindMscTrCick() {
    var imgs = $(" #changemusic table tr td img");
    $("#changemusic ul.music_list table tr ").unbind('click').bind('click', function () {
        var tr = $(this);
        var radio = tr.find('input[type=radio]');
        radio[0].checked = true;
        var img = tr.find("td img");
        if (img.hasClass("playing")) {
            mscPause();
            img.attr('src', templatestyle + '/Edit_img/music_p.png');
        }
        else {
            imgs.filter(".playing").attr('src', templatestyle + '/Edit_img/music_p.png').removeClass("playing");
            img.attr('src', templatestyle + '/Edit_img/music_zt.png');
            var td = img.parent('td');
            var src = td.siblings('td').children('input[type=radio]').attr('data-src');
            setBgMsc(src);
            mscPlay();
        }
        img.toggleClass("playing")
    });
}
//点击播放按钮
function bindClickPlay() {
    var imgs = $(" #changemusic table tr td img");
    imgs.unbind('click').bind('click', function (e) {
        e.stopPropagation(); //20151216取消注释
        var img = $(this);
        if (img.hasClass("playing")) {
            mscPause();
            img.attr('src', templatestyle + '/Edit_img/music_p.png');
        }
        else {
            imgs.filter(".playing").attr('src', templatestyle + '/Edit_img/music_p.png').removeClass("playing");
            img.attr('src', templatestyle + '/Edit_img/music_zt.png');
            var td = img.parent('td');
            var src = td.siblings('td').children('input[type=radio]').attr('data-src');
            setBgMsc(src);
            mscPlay();
        }
        img.toggleClass("playing")
    });
}
//确认选择
function confirmMsc() {
    var c = $("#changemusic input[name=r]:checked");
    if (c[0]) {
        var src = c.attr('data-src');
        setBgMsc(src);
        //音乐ID
        var mscId = c.val();
        var name = c.parent('td').next('td').text().trim();
        $("#edit_music .input4").val(name);
        $("#stPlayer").attr('data-name', name);
        $("#mscName").text(name);
        $("#mscId").val(mscId);
        hideMscDialog();
    } else {
        showTopTip("没有选中的音乐！");
    }
}
//删除背景音乐
function delBgMsc() {
    var src = $("#stPlayer").attr('src');
    if (src) {
        $("#stPlayer").attr('src', '');
    }
    var name = "暂无背景音乐"
    $("#edit_music .input4").val(name);
    $("#stPlayer").attr('data-name', name);
    $("#mscName").text(name);
}
//设置背景音乐
function setBgMsc(src) {
    $("#stPlayer").attr('src', src);
}
//播放
function mscPlay() {
    document.getElementById("stPlayer").play();
}
//暂停
function mscPause() {
    document.getElementById("stPlayer").pause();
}
//管理音乐  20151216增加
function manageMsc() {
    var text = $("#manageMsc").text().trim();
    if (text == "管理音乐") {
        $("#manageMsc").text("退出管理");
        //显示删除按钮
        $("#myTab7_Content1 div.qrxz").hide();
        $("#myTab7_Content1 div.delpic").show().unbind('click').bind('click', deleteMyMsc);
        //显示复选框
        $("#myTab7_Content1 input[name='r']").hide();
        $("#myTab7_Content1 input[name='mscSel']").show();
        //绑定每行单击选中事件
        var trs = $("#changemusic ul.music_list table tr");
        trs.unbind('click').bind('click', function () {
            var mscSel = $(this).find("input[name='mscSel']")[0];
            var checked = mscSel.checked;
            mscSel.checked = !checked;
        });
        //防止复选框单击冒泡
        trs.find("input[name='mscSel']").unbind('click').bind('click', function (e) {
            e.stopPropagation();
        });
        //绑定点击音乐按钮
        bindClickPlay();
        //暂停正在播放的音乐
        var playingMsc = trs.find('img.playing');
        if (playingMsc[0]) {
            mscPause();
            playingMsc.attr('src', templatestyle + '/Edit_img/music_p.png');
        }
    } else {
        tcManageMsc();
    }
}
//退出管理音乐  20151216增加
function tcManageMsc() {
    $("#manageMsc").text("管理音乐");
    //隐藏删除按钮
    $("#myTab7_Content1 div.qrxz").show();
    $("#myTab7_Content1 div.delpic").hide();
    //隐藏复选框
    $("#myTab7_Content1 input[name='r']").show();
    $("#myTab7_Content1 input[name='mscSel']").hide();
    //绑定每行单击选中事件
    bindMscTrCick();
    //取消绑定点击音乐按钮事件
    $(" #changemusic table tr td img").unbind('click')
    //取消已选中的复选框
    $("#changemusic ul.music_list table tr input[name='mscSel']").each(function () {
        this.checked = false;
    });

}

//显示音乐上传弹窗
function showMusicXjfz() {
    $("#changemusic div.newtc").fadeIn(100);
}
//隐藏上传音乐弹窗
function hideMusicXjfz() {
    $("#changemusic div.newtc").fadeOut(100);
}

function IsURL(str_url) {
    var strRegex = "((https|http|ftp|rtsp|mms):\/\/)(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)";
    var re = new RegExp(strRegex, "i");
    //re.test()
    if (re.test(str_url)) {
        return true;
    } else {
        return false;
    }
}
//==============================华丽分割线09====背景音乐  end====================================

//==============================华丽分割线10====样式选项卡  begin================================
//显示样式-动画操作面板  20151215 修改,替换该方法
function showYangShi_Ani(type) {
    hideRightPanels();
    $("#edit_style_ani").fadeIn();
    changeYangShi_AniTab(type);
    bindYangShi_Ani();
}
function bindEvYangShi_Ani() {
    $("#edit_style_ani .menu").click(function () {
        var menu = $(this).next("div.bgfff");
        if (menu.css("display") == "none") {
            menu.show();
            menu.siblings("div.bgfff").hide();
        } else {
            menu.hide();
        }
    });
}
//隐藏样式-动画操作面板
function hideYangShi_Ani() {
    $("#edit_style_ani").hide();
}
//切换样式、动画tab 20151215 增加新方法
function changeYangShi_AniTab(type) {
    $("#styleTab0").show();
    if (type == 2) $("#aniTab")[0].click();
    else $("#styleTab0")[0].click();
}
//绑定样式、动画当前值 20151215 增加新方法
function bindYangShi_Ani() {
    if (Ctype == 1) {//图片
        initImgStyleTab();
        //初始化滤镜
        setLvJingObj();
    } else if (Ctype == 2) {//文字
        initFontStyleTab();
    } else if (Ctype == 3) {//20160123 增加一行
        initVideoStyleTab();
    } else if (Ctype == 501 || Ctype == 502 || Ctype == 503 || Ctype == 504) {//20160123 增加一行
        initInputStyleTab();
    } else if (Ctype == 6) {//20160123 增加一行
        initSubmitBtnStyleTab();
    } else if (Ctype == 8) {//20160123 增加一行
        initTelBtnStyleTab();
    }
    initCommonStyleOfTab();
    initAnimateTab();
}
//初始化文字的样式tab  20151215 修改,替换该方法
function initFontStyleTab() {
    var table = $("#edit_style_ani table").first();
    trs = table.find("tr").show();
    //滤镜隐藏
    $("#edit_style_ani .lj").hide();
    $("#edit_style_ani .lj").next(".bgfff").hide();
    //var text = Contents.html().trim();
    //var fontFamily = Contents.css("font-family").replace(/"/ig, '');//20151123
    //var fontSize = Contents.css("font-size");
    //var textAlign = Contents.css("text-align");
    var color = rgbToRgba(Contents.css("color"));
    var lineHeight = Contents[0].style.lineHeight;                 //20151215 增加
    var paddingTop = MidBox.css("padding-top").split('p')[0];      //20151215 增加

    //editWords(text);
    //setFontFamily(fontFamily);
    //setFontSize(fontSize);
    //setTextAlign(textAlign);
    setFontColor(color);
    setLineHeight($("#lineHeightEdit"), lineHeight);             //20151215 增加
    setPaddingTop($("#paddingTopEdit"), paddingTop);             //20151215 增加
}
//初始化图片的样式tab  20151215 修改,替换该方法
function initImgStyleTab() {
    var table = $("#edit_style_ani table").first();
    trs = table.find("tr");
    trs.show();
    //颜色、行高、边距隐藏
    trs.eq(0).hide();
    trs.eq(3).hide();
    trs.eq(4).hide();
    $("#edit_style_ani .lj").show();
}
//初始化视频按钮的样式tab  20160123新增
function initVideoStyleTab() {
    var table = $("#edit_style_ani table").first();
    trs = table.find("tr").show();
    trs.eq(0).hide();
    trs.eq(3).hide();
    trs.eq(4).hide();
    $("#edit_style_ani .lj").hide().next(".bgfff").hide();
}
//初始化输入框的样式tab  20160123新增
function initInputStyleTab() {
    var table = $("#edit_style_ani table").first();
    trs = table.find("tr").show();
    trs.eq(0).hide();
    trs.eq(3).hide();
    $("#edit_style_ani .lj").hide().next(".bgfff").hide();
    var paddingTop = MidBox.css("padding-top").split('p')[0];
    setPaddingTop($("#paddingTopEdit"), paddingTop);
}
//初始化提交按钮的样式tab  20160123新增
function initSubmitBtnStyleTab() {
    var table = $("#edit_style_ani table").first();
    trs = table.find("tr").show();
    trs.eq(3).hide();
    $("#edit_style_ani .lj").hide().next(".bgfff").hide();
    var color = rgbToRgba(Contents.css("color"));
    var paddingTop = MidBox.css("padding-top").split('p')[0];
    setFontColor(color);
    setPaddingTop($("#paddingTopEdit"), paddingTop);
}
//初始化拨号按钮的样式tab  20160123新增
function initTelBtnStyleTab() {
    var table = $("#edit_style_ani table").first();
    trs = table.find("tr").show();
    trs.eq(3).hide();
    $("#edit_style_ani .lj").hide().next(".bgfff").hide();
    var color = rgbToRgba(Contents.css("color"));
    var paddingTop = MidBox.css("padding-top").split('p')[0];
    setFontColor(color);
    setPaddingTop($("#paddingTopEdit"), paddingTop);
}
//初始化文字、图片等元素共有的样式 20151215 增加
function initCommonStyleOfTab() {
    //背景色、旋转、透明度、边框、阴影
    var bgColor = rgbToRgba(MidBox.css("background-color"));
    var rotateDeg = getRotateDeg(NowBox);
    var opacity = !MidBox[0].style.opacity ? 1 : MidBox[0].style.opacity;//(这种写法是为了防止播放动画时获取的值不对)
    var borderWidth = justGetNum(MidBox.css("border-width"));
    var borderRadius = justGetNum(MidBox.css("border-radius"));
    var borderStyle = MidBox.css('border-style');
    var borderColor = rgbToRgba(MidBox.css("border-color"));
    var boxShadow = MidBox.css('box-shadow');
    setElBgColor($("#bgColorEdit"), bgColor);
    setRotateZ($("#rotateEdit"), rotateDeg);
    setOpacity($("#opacityEdit"), (100 - opacity * 100));
    setBorderWidth($("#borderWidthEdit"), borderWidth);
    setBorderRadius($("#borderRadiusEdit"), borderRadius);
    setBorderStyle("borderStyleEdit", borderStyle);
    setBorderColor($("#borderColorEdit"), borderColor);
    var shadowArr = ["0px", "0px", "0px", "0px", 'rgba(0, 0, 0, 1)'];
    if (boxShadow != "none") {
        var sColor = boxShadow.substring(boxShadow.indexOf('rgb'), boxShadow.lastIndexOf(')') + 1);
        if (sColor.toLowerCase().lastIndexOf('rgba') < 0)
            sColor = 'rgba' + sColor.substring(sColor.indexOf('('), sColor.indexOf(')')) + ',1)';
        shadowArr = boxShadow.split(')')[1].trim().split(' ');
        shadowArr.push(sColor);
    }
    setBoxShadowShadowX($("#boxShadowXEdit"), shadowArr[0].split('p')[0]);
    setBoxShadowShadowY($("#boxShadowYEdit"), shadowArr[1].split('p')[0]);
    setBoxShadowBlur($("#boxShadowBlurEdit"), shadowArr[2].split('p')[0]);
    setBoxShadowSize($("#boxShadowSizeEdit"), shadowArr[3].split('p')[0]);
    setBoxShadowColor($("#boxShadowColorEdit"), shadowArr[4]);
}
//编辑文字
function editWords(text) {
    var reg = new RegExp("<br>", "g");                       //20151020 修改【换行bug】
    var text = text.replace(reg, "\n");                      //20151020 修改【换行bug】
    reg = new RegExp("&nbsp;&nbsp;", "g");                   //20151223 修改【空格bug】
    text = text.replace(reg, " ");                           //20151223 修改【空格bug】
    $("#textEdit").val(text);                                //20151020 修改【换行bug】
    $("#textEdit").unbind().keyup(function () {
        var html = $(this).val().replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;&nbsp;"); //20151223 修改【空格bug】
        Contents.html(html);                                                            //20151223 修改【空格bug】
        updateSlide();
    })
        //.change(function () {   // 删除change事件监听  20151016 
        //    Contents.html($(this).val());
        //    updateSlide();
        //})
        .focus(function () {        // 20151016 添加
            $(this).addClass("focus");
        }).blur(function () {       // 20151016 添加
            $(this).removeClass("focus");
        });
}
//切换字体
function setFontFamily(nowValue) {
    setFFtoList();
    setDefaultOption("fontFamilyEdit", nowValue); //20151123  增加该行
    //20151123  注释掉以下
    // var select = $("#fontFamilyEdit");
    // var name = select.attr("name");
    //$("#select_info_" + name).text(nowValue);
    //$("#options_" + name + ">li").unbind().click(function () {
    //    var newValue = $("#selected_" + name).text();
    //    changeStyle("font-family", newValue);
    //});
}
//设置下拉列表选项的字体
function setFFtoList() {
    $("#options_language li").each(function (i) {
        $(this).css('font-family', $(this).text().trim());
    });
}
//设置字号
function setFontSize(nowValue) {
    setDefaultOption("fontSizeEdit", nowValue); //20151123  增加该行
    //20151123  注释掉以下
    // var select = $("#fontSizeEdit");
    // var name = select.attr("name");
    //$("#select_info_" + name).text(nowValue);
    //$("#options_" + name + ">li").unbind().click(function () {
    //    var newValue = $("#selected_size").text();
    //    changeStyle("font-size", newValue);
    //});
}
//设置对齐方式
function setTextAlign(nowValue) {
    var aligns = ['left', 'center', 'right'];
    var alignList = $("#textAlignEdit >li");
    alignList.children('a').removeClass("active");
    if (nowValue == 'start' || nowValue == aligns[0]) {
        alignList.eq(0).children('a').addClass("active");
    } else if (nowValue == aligns[1]) {
        alignList.eq(1).children('a').addClass("active");
    } else if (nowValue == aligns[2]) {
        alignList.eq(2).children('a').addClass("active");
    }
    alignList.unbind().click(function () {
        alignList.children('a').removeClass("active");
        var newValue = aligns[$(this).index()];
        alignList.eq($(this).index()).children('a').addClass("active");
        changeStyle("text-align", newValue);
    });
}
//设置文本颜色
function setFontColor(color) {
    var o = $("#fontColorEdit");
    var model = o.attr('model');
    o.css('background-color', color).attr('data-color', color);
    o.siblings('div.r').first().children('input').val(color);

    ColorSelect.init(o, function (value) {
        //改变颜色值之后的处理
        o.css('background', value);
        o.siblings('div.r').first().children('input').val(value);
        changeStyle(model, value);
    });
}
//设置元素背景色
function setElBgColor(o, color) {
    //var o = $("#bgColorEdit");
    var model = o.attr('model');
    o.css('background-color', color).attr('data-color', color);
    o.siblings('div.r').first().children('input').val(color);
    //--20151105 增加 begin
    var colorObj = getRgbaObj(color);
    parseFloat(colorObj.a) - 0 == 0 ? o.attr('data-color', "rgba(" + colorObj.r + "," + colorObj.g + "," + colorObj.b + ",0.5)") : '';

    //--20151105 增加 end
    ColorSelect.init(o, function (value) {
        //改变颜色值之后的处理
        o.css('background', value);
        o.siblings('div.r').first().children('input').val(value);
        changeStyle(model, value);
    });
}
//设置旋转角度 20151215修改
function setRotateZ(o, value) {
    setUiSliderValue(o, value);
}
//设置行高 20151215增加
function setLineHeight(o, value) {
    setUiSliderValue(o, value);
}
//设置边距 20151215增加
function setPaddingTop(o, value) {
    setUiSliderValue(o, value);
}
//设置边距 20151215增加
function setOpacity(o, value) {
    setUiSliderValue(o, value);
}
//设置边框尺寸 20151215增加
function setBorderWidth(o, value) {
    setUiSliderValue(o, value);
}
//设置边框弧度 20151215增加
function setBorderRadius(o, value) {
    setUiSliderValue(o, value);
}
//设置边框样式 20151215增加
function setBorderStyle(selectId, value) {
    if (value == "none") { value = 'solid', MidBox.css('border-style', value); }
    setDefaultOption(selectId, value);
}
//设置边框颜色 20151215增加
function setBorderColor(o, color) {
    //var o = $("#borderColorEdit");
    var model = o.attr('model');
    o.css('background-color', color).attr('data-color', color);
    o.siblings('div.r').first().children('input').val(color);
    ColorSelect.init(o, function (value) {
        //改变颜色值之后的处理
        o.css('background', value);
        o.siblings('div.r').first().children('input').val(value);
        changeStyle(model, value);
    });
}
//设置阴影大小 20151215增加
function setBoxShadowSize(o, value) {
    setUiSliderValue(o, value);
}
//设置阴影模糊 20151215增加
function setBoxShadowBlur(o, value) {
    setUiSliderValue(o, value);
}
//设置阴影横向偏移 20151215增加
function setBoxShadowShadowX(o, value) {
    setUiSliderValue(o, value);
}
//设置阴影纵向偏移 20151215增加
function setBoxShadowShadowY(o, value) {
    setUiSliderValue(o, value);
}
//设置阴影颜色 20151215增加
function setBoxShadowColor(o, color) {
    //var o = $("#borderColorEdit");
    var model = o.attr('model');
    o.css('background-color', color).attr('data-color', color);
    o.siblings('div.r').first().children('input').val(color);
    ColorSelect.init(o, function (value) {
        //改变颜色值之后的处理
        o.css('background', value);
        o.siblings('div.r').first().children('input').val(value);
        changeStyle(model, value);
    });
}
//设置链接
function setElLink() {

    var link = "";

}
//清除样式 20151215 替换该方法即可
function clearStyle() {
    //背景色、旋转、透明度、边框、阴影
    var bgColor = rgbToRgba(MidBox.css("background-color"));
    var rotateDeg = getRotateDeg(NowBox);
    var opacity = !MidBox[0].style.opacity ? 1 : MidBox[0].style.opacity;//(这种写法是为了防止播放动画时获取的值不对)
    var borderWidth = justGetNum(MidBox.css("border-width"));
    var borderRadius = justGetNum(MidBox.css("border-radius"));
    var borderStyle = MidBox.css('border-style');
    var borderColor = rgbToRgba(MidBox.css("border-color"));
    var boxShadow = MidBox.css('box-shadow');
    MidBox.css({
        'background-color': 'rgba(0,0,0,0)',
        'opacity': '1',
        'border': '0px solid rgba(0,0,0,1)',
        'border-radius': '0px',
        'box-shadow': 'none',
    });
    var rotateZ = "rotateZ(0deg)";
    NowBox[0].style.transform = rotateZ;
    NowBox[0].style.webkitTransform = rotateZ;
    NowBox[0].style.mozTransform = rotateZ;
    NowBox[0].style.msTransform = rotateZ;
    NowBox[0].style.oTransform = rotateZ;
    if (Ctype == 2) {
        MidBox.css({ 'padding-top': '0px' });
        Contents.css({ 'color': 'rgba(0,0,0,1)' });
        Contents[0].style.lineHeight = 1;
        initFontStyleTab();
    }
    initCommonStyleOfTab();
    updateSlide();//20160115 增加 
}
//设置滑动条初始值 20151215增加
function setUiSliderValue(o, value) {
    var model = o.attr('model');
    o.attr('value', parseFloat(value));
    var slider = UiSlider.init(o,
        {
            "change": function (val) {
                //改变值之后的处理
                o.attr('value', val);
                o.siblings('input.uiSlider_value').first().val(val);  //20151105 修改
                changeStyle(model, val);
            },
            "stop": function (val) {
                updateSlide();
            }
        }
    );
}
//转为rgba格式颜色值
function rgbToRgba(color) {
    try {
        if (color.toLowerCase().lastIndexOf('rgba') < 0)
            color = 'rgba' + color.substring(color.indexOf('('), color.indexOf(')')) + ', 1)';
        else {
            var alpha = parseFloat(color.split(',')[3].split(')')[0]).toFixed(2);
            if (alpha % 0.1 == 0) {
                alpha = parseFloat(alpha).toFixed(1);
            }
            if (alpha == 0) { alpha = 0; }
            if (alpha == 1) { alpha = 1; }
            color = 'rgba' + color.substring(color.indexOf('('), color.lastIndexOf(',')) + ', ' + alpha + ')';
        }
    } catch (e) { }
    return color;
}
//获取rgba的对象 20151105
function getRgbaObj(rgba) {
    var colorArr = rgba.substring(rgba.indexOf('(') + 1, rgba.indexOf(')')).split(',');
    return { "r": colorArr[0], "g": colorArr[1], "b": colorArr[2], "a": colorArr[3] };
}
//获取旋转角度
function getRotateDeg(box) {
    var style = box.attr('style');
    if (typeof style != "undefined" && style.lastIndexOf("transform") >= 0)
        val = style.split('rotateZ(')[1].split('deg')[0];
    else val = 0;
    return val;
}
//初始化滑动条右侧数字输入框  20151105 增加该方法
function uiSlider_value(o, slider) {
    var model = o.attr('model');
    var input = o.siblings('.uiSlider_value').val(parseFloat(o.attr('value')));
    var min = parseFloat(input.attr("min")), max = parseFloat(input.attr("max")), step = input.attr("step");
    input.unbind().bind('change', function () {
        var val = parseFloat(input.val());
        slider.slider("value", val);
        changeStyle(model, val);
    }).bind('input', function (e) {
        var val = input.val();
        if (val) {
            if (step.indexOf('.') == "-1") { //要求值为整数
                val = parseInt(justGetNum(val));
            } else {                         //可以为小数
                if (val.indexOf('.') > 0 && val.split(".")[1].length > 0)
                    val = parseFloat(val).toFixed(1);
            }
            if (val > max) val = max;
            input.val(val);
        } else {   //非法值，改为最小值
            val = min;
        }
        slider.slider("value", val);
        if (model.lastIndexOf("animate") != -1)
            changeAniOptions(model, val);
        else
            changeStyle(model, val);
    });
}
//滑动条对象
var UiSlider = {
    init: function (o, callback) {
        var min = parseFloat(o.attr('min')), max = parseFloat(o.attr('max')), step = parseFloat(o.attr('step'));
        var startNum = parseFloat(o.attr('value'));
        var slider = o.slider({
            min: min, max: max, step: step, range: "min",
            value: startNum,
            start: function (event, ui) { },
            slide: function (event, ui) { callback.change(ui.value); },
            change: function (event, ui) { },
            stop: function (event, ui) { callback.stop(ui.value); }
        });
        uiSlider_value(o, slider);     //20151105 增加
        return slider;                 //20151105 
    }
};

//颜色选择器
var ColorSelect = {
    init: function (o, change) {
        o.colorpicker('hide').on('changeColor', function (ev) {
            var c = ev.color.toRGB();
            var value = "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
            change(value);
        });
        o.colorpicker("setValuePanel", o.attr("data-color")); // 20151113 颜色选择器bug
    }
}
//改变某样式的值
function changeStyle(name, value) {
    if (name == 'font-size' || name == "color" || name == "text-align" || name == "font-family" || name == "line-height") {//20151215增加 line-height
        Contents.css(name, value);
    } else if (name == "background-color" || name == "padding-top" || name.lastIndexOf("border") > -1) {//20151215增加 padding-top、border，去掉opacity
        MidBox.css(name, value);
    } else if (name == "opacity") {                  //20151215增加 该分支
        MidBox.css(name, (100 - value) / 100);
    } else if (name.lastIndexOf("boxShadow") > -1) { //20151215增加 该分支
        value = getBoxShadowValueStr(name, value);
        name = "box-shadow";
        MidBox.css(name, value);
    } else if (name == "z-idnex") {
        NowBox.css(name, value);
    }
    else if (name == "transform") {
        value = "rotateZ(" + value + "deg)";
        NowBox[0].style.transform = value;
        NowBox[0].style.webkitTransform = value; //20151215 兼容性修改，加上前缀 /* Safari 和 Chrome */
        NowBox[0].style.mozTransform = value;    //20151215 兼容性修改，加上前缀 /* Firefox */
        NowBox[0].style.msTransform = value;     //20151215 兼容性修改，加上前缀 /* IE 9 */
        NowBox[0].style.oTransform = value;      //20151215 兼容性修改，加上前缀 /* Opera */
    }
    updateSlide();
}
//根据阴影的单个属性名和值获取阴影的整个样式字符串   20151215增加
function getBoxShadowValueStr(name, value) {
    var boxShadow = MidBox.css('box-shadow');
    var shadowArr = ["0px", "0px", "0px", "0px", 'rgba(0, 0, 0, 1)'];
    var boxShadowColor = shadowArr[4];
    if (boxShadow != "none") {
        boxShadowColor = "r" + boxShadow.split("r")[1].split(")")[0] + ")";
        shadowArr = boxShadow.replace(boxShadowColor, "").trim().split(' ');
        shadowArr[4] = boxShadowColor
    }
    if (name == 'boxShadowX')
        shadowArr[0] = value + "px";
    else if (name == 'boxShadowY')
        shadowArr[1] = value + "px";
    else if (name == 'boxShadowBlur')
        shadowArr[2] = value + "px";
    else if (name == 'boxShadowSize')
        shadowArr[3] = value + "px";
    else if (name == 'boxShadowColor')
        shadowArr[4] = value;
    value = shadowArr[0].split('p')[0] + "px " + shadowArr[1].split('p')[0] + "px " + shadowArr[2].split('p')[0] + "px " + shadowArr[3].split('p')[0] + "px " + shadowArr[4];
    return value;
}
//==============================华丽分割线10====样式选项卡  end====================================

//==============================华丽分割线11====动画选项卡  begin==================================
//初始化动画tab
function initAnimateTab() {
    $("#myTab1_Content1  .uiSlider").each(function () {
        var o = $(this);
        var model = o.attr('model');
        if (model == 'animate-duration') {
            setAniDuration(o);
        } else if (model == 'animate-delay') {
            setAniDelay(o);
        } else if (model == "animate-count") {
            setAniCount(o);
        }
    });
    var effect = MidBox.attr("swiper-animate-effect");    //20151025 旋转后动画bug NowBox替换为MidBox
    !effect ? effect = "none" : "";                       //20151105
    //20160115 修改begin
    var name = effect;
    if (effect != "slideInLeft" && effect != "slideOutLeft") {
        name = effect.replace("Right", "").replace("Left", "").replace("Up", "").replace("Down", "");
    }
    setDefaultOption("donghua", name);
    //20160115 修改end
    bindDirectionSelect(effect);                          //20151105
    aniStartStore();
}
//设置动画时间
function setAniDuration(o) {
    var name = 'animate-duration';
    var value = MidBox.attr('swiper-' + name);    //20151025 旋转后动画bug NowBox替换为MidBox
    if (!value) value = '2s'
    value = value.split('s')[0];
    o.attr('value', parseFloat(value));           //20151105
    o.siblings('div.uiSlider_value').first().text(value);
    UiSlider.init(o,
        {
            "change": function (val) {
                //获取值之后的处理
                o.attr('value', val);
                o.siblings('input.uiSlider_value').first().val(val);  //20151105 修改
                changeAniOptions(name, val);
            },
            "stop": function (val) {

            }
        }
    );
}
//设置动画延迟时间
function setAniDelay(o) {
    var name = 'animate-delay';
    var value = MidBox.attr('swiper-' + name);    //20151025 旋转后动画bug NowBox替换为MidBox
    if (!value) value = '0s'
    value = value.split('s')[0];
    o.attr('value', parseFloat(value));           //20151105
    o.siblings('div.uiSlider_value').first().text(value);
    UiSlider.init(o,
        {
            "change": function (val) {
                //获取值之后的处理
                o.attr('value', val);
                o.siblings('input.uiSlider_value').first().val(val);  //20151105 修改
                changeAniOptions(name, val);
            },
            "stop": function (val) {
                updateSlide();
            }
        }
    );
}
//设置动画次数
function setAniCount(o) {
    var name = 'animate-count';
    var value = MidBox.attr('swiper-' + name);    //20151025 旋转后动画bug NowBox替换为MidBox
    if (value == 'infinite') {
        value = 1; //o.attr('max');
        //o.siblings('div.uiSlider_value').first().text("");
        o.attr('value', parseInt(value));
        setXunHuan();
    } else {
        if (!value) value = '1';
        else value = value;
        //o.siblings('div.uiSlider_value').first().text(value);
        o.attr('value', parseInt(value));
        cancelXunHuan();
    }
    o.siblings('div.uiSlider_value').first().text(value);
    UiSlider.init(o,
        {
            "change": function (val) {
                cancelXunHuan();
                //获取值之后的处理
                o.attr('value', val);
                o.siblings('input.uiSlider_value').first().val(val);  //20151105 修改
                changeAniOptions(name, val);
            },
            "stop": function (val) {
                updateSlide();
            }
        }
    );
}
//设置循环播放
function setXunHuan() {
    var o = $("#ch_effects").siblings("span.tzCheckBox").removeClass('checked')[0].click();
}
//取消循环
function cancelXunHuan() {
    var o = $("#ch_effects").siblings("span.tzCheckBox");
    if (o.hasClass("checked")) {
        $("#ch_effects").siblings("span.tzCheckBox")[0].click();
    }
}
//修改动画的配置选项
function changeAniOptions(name, value) {
    if (name == 'animate-duration' || name == 'animate-delay') {
        value = value + "s";
    } else if (name == "animate-count") { }
    MidBox.attr("swiper-" + name, value);    //20151025 旋转后动画bug NowBox替换为MidBox
}
//设置动画名  20151105 修改该方法
function setAniEffect(value) {
    if (value != "none") changeAnimate(value);
    else {
        MidBox.attr('swiper-animate-effect', "");
        MidBox.css({ 'animation-name': '', '-webkit-animation-name': '' });
        MidBox.css({ 'animation-duration': '', '-webkit-animation-duration': '' });
        MidBox.css({ 'animation-delay': '', '-webkit-animation-delay': '' });
        MidBox.css({ 'animation-count': '', '-webkit-animation-count': '' });
    }
    bindDirectionSelect(value);
}

//绑定方向下拉列表 20160115 替换该方法即可
function bindDirectionSelect(effect) {
    var arr = effect_desc[effect];//根据动画名获取描述、方向数组
    var desc = arr[0];//动画描述
    if (arr.length == 1) {//
        $("#directionTr").hide();
    }
    else if (arr.length == 2) {
        $("#directionTr").show();
        if (arr[1] == "") {
            setAniDirection("Center");
        } else {
            setAniDirection(arr[1]);
            if (effect.lastIndexOf("slide") > -1)
                $("#options_fangxiang >li").eq(4).hide();
        }
    }
}
//设置动画方向  20151105 修改该方法
function setAniDirection(val) {
    setDefaultOption("fangxiang", val);
    var nowEffect = MidBox.attr('swiper-animate-effect');    //20151025 旋转后动画bug NowBox替换为MidBox
    var newEffect = nowEffect;
    newEffect = nowEffect.replace("Right", "").replace("Left", "").replace("Up", "").replace("Down", "");
    if (val != "Center") {
        if (newEffect.lastIndexOf("Out") >= 0) {
            if (val == "Left") val = "Right";
            else if (val == "Right") val = "Left";
        }
        newEffect = newEffect + val;
    }
    changeAnimate(newEffect);
}
//切换动画 20151025 旋转后动画bug 替换该方法
function changeAnimate(effect) {
    var box = MidBox;
    box.attr('swiper-animate-effect', effect);
    previewOneAni(box);
    removeAnimateOne(box);
    return;
}
//重置动画到未编辑前状态
function resetAniOption() {
    var box = MidBox;
    box.attr('swiper-animate-effect', aniStartState[0]);
    box.attr('swiper-animate-duration', aniStartState[1]);
    box.attr('swiper-animate-delay', aniStartState[2]);
    box.attr('swiper-animate-count', aniStartState[3]);
    initAnimateTab();
}
//播放所有动画
function playAnimateAll() {
    Phone.find('.ani').each(function () {
        playAnimateOne($(this));
    });
    removeAnimateAll();
}
//播放指定元素动画
function playAnimateOne(jq) {
    var elm = jq.get(0);
    elm.style.visibility = "visible";
    effect = elm.attributes["swiper-animate-effect"] ? elm.attributes["swiper-animate-effect"].value : "";
    if (effect == "") return;
    duration = elm.attributes["swiper-animate-duration"] ? elm.attributes["swiper-animate-duration"].value : "2s";
    delay = elm.attributes["swiper-animate-delay"] ? elm.attributes["swiper-animate-delay"].value : "0s";
    count = elm.attributes["swiper-animate-count"] ? elm.attributes["swiper-animate-count"].value : "1";
    jq.removeClass('ani').removeClass('animated').removeClass(effect).addClass(effect).addClass('animated').addClass('ani');
    jq.css({ 'animation-name': effect, '-webkit-animation-name': effect });
    jq.css({ 'animation-duration': duration, '-webkit-animation-duration': duration });
    jq.css({ 'animation-delay': delay, '-webkit-animation-delay': delay });
    jq.css({ 'animation-count': count, '-webkit-animation-count': count });
    style = elm.attributes["style"].value;
    elm.setAttribute("style", style);
}
//预览一个元素的动画效果，没有延迟和次数
function previewOneAni(jq) {
    var elm = jq.get(0);
    elm.style.visibility = "visible";
    effect = elm.attributes["swiper-animate-effect"] ? elm.attributes["swiper-animate-effect"].value : "";
    if (effect == "" || effect == "none") return;
    duration = elm.attributes["swiper-animate-duration"] ? elm.attributes["swiper-animate-duration"].value : "2s";
    delay = 0;
    jq.removeClass('ani').removeClass('animated').removeClass(effect).addClass(effect).addClass('animated').addClass('ani');
    jq.css({ 'animation-name': effect, '-webkit-animation-name': effect });
    jq.css({ 'animation-duration': duration, '-webkit-animation-duration': duration });
    jq.css({ 'animation-delay': delay, '-webkit-animation-delay': delay });
    style = elm.attributes["style"].value;
    elm.setAttribute("style", style);
}
//动画结束后移除所有动画
function removeAnimateAll() {
    $('.ani').each(function () {
        removeAnimateOne($(this));
    });
}
//指定元素动画结束后移除动画
function removeAnimateOne(jq) {
    var effect = jq.attr('swiper-animate-effect') ? jq.attr('swiper-animate-effect') : '';
    jq.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        jq.removeClass(effect).removeClass('animated');
    });
}
//预览本页
function previewNowPage() {
    var o = $("#" + PhoneId + " .el-box-active").removeClass('el-box-active');
    removeResizeBars();//移除resize的点
    hideYangShi_Ani();//隐藏样式-动画操作面板
    var html = Phone.html();
    Phone.html(html);
    //playAnimateAll(); //20151025 旋转后动画bug 注释该行，因为多余了
    initPhone();
}
//初始化开关效果复选框 循环开关
function initCheckbox() {
    $('#ch_effects').tzCheckbox({ labels: ['Enable', 'Disable'] }, function () {
        var cheked = $('#ch_effects').siblings("span.tzCheckBox").hasClass("checked");
        //cheked ? setXunHuan() : cancelXunHuan();
        if (cheked) MidBox.attr("swiper-animate-count", "infinite");                  //20151025 旋转后动画bug NowBox替换为MidBox
        else {
            MidBox.attr("swiper-animate-count", $("#aniCountEdit").attr('value'));    //20151025 旋转后动画bug NowBox替换为MidBox
            setAniCount($("#aniCountEdit"));
        }
    });
}
//存储动画的初始状态，便于重置  20151025 旋转后动画bug 替换该方法
function aniStartStore() {
    var box = MidBox;
    var effect = box.attr('swiper-animate-effect') ? box.attr('swiper-animate-effect') : "none";
    var duration = box.attr('swiper-animate-duration') ? box.attr('swiper-animate-duration') : "2s";
    var delay = box.attr('swiper-animate-delay') ? box.attr('swiper-animate-delay') : "0s";
    var count = box.attr('swiper-animate-count') ? box.attr('swiper-animate-count') : "1";
    aniStartState = [effect, duration, delay, count];
}
//动画名描述(方向)对应关系
var effect_desc = {
    "none": ["无"],
    "bounce": ["弹跳"],
    "flash": ["闪动"],
    "pulse": ["脉动"],
    "rubberBand": ["抖动"],
    "shake": ["摇动"],
    "swing": ["摆动"],
    "tada": ["晃动"],
    "wobble": ["大幅晃动"],
    "bounceIn": ["弹跳进入", ""],
    "bounceInLeft": ["弹跳进入", "Left"],
    "bounceInRight": ["弹跳进入", "Right"],
    "bounceInUp": ["弹跳进入", "Up"],
    "bounceInDown": ["弹跳进入", "Down"],
    "bounceOut": ["弹跳离开", ""],
    "bounceOutLeft": ["弹跳离开", "Left"],
    "bounceOutRight": ["弹跳离开", "Right"],
    "bounceOutUp": ["弹跳离开", "Up"],
    "bounceOutDown": ["弹跳离开", "Down"],
    "fadeIn": ["淡入", ""],
    "fadeInLeft": ["淡入", "Left"],
    "fadeInRight": ["淡入", "Right"],
    "fadeInUp": ["淡入", "Up"],
    "fadeInDown": ["淡入", "Down"],
    "fadeOut": ["淡出", ""],
    "fadeOutDown": ["淡出", "Down"],
    "fadeOutLeft": ["淡出", "Left"],
    "fadeOutRight": ["淡出", "Right"],
    "fadeOutUp": ["淡出", "Up"],
    "slideInUp": ["滑动进入", "Up"],
    "slideInDown": ["滑动进入", "Down"],
    "slideInLeft": ["滑动进入", "Left"],
    "slideInRight": ["滑动进入", "Right"],
    "slideOutUp": ["滑动离开", "Up"],
    "slideOutDown": ["滑动离开", "Down"],
    "slideOutLeft": ["滑动离开", "Left"],
    "slideOutRight": ["滑动离开", "Right"],
    "flipInY": ["翻转进入"],
    "flipOutY": ["翻转离开"],
    "lightSpeedIn": ["光速进入"],
    "lightSpeedOut": ["光速离开"],
    "zoomIn": ["中心放大"],
    "zoomOut": ["中心缩小"],
    "rotateIn": ["旋转进入"],
    "rotateOut": ["旋转离开"]
}

var directions = {
    "Left": "从左向右",
    "Right": "从右向左",
    "Up": "从下到上",
    "Down": "从上到下",
    "Center": "中心变化"
}
var effect_type = { "none": "0", "bounce": "1", "flash": "2", "pulse": "3", "rubberBand": "4", "shake": "5", "swing": "6", "tada": "7", "wobble": "8", "bounceIn": "9", "bounceInLeft": "10", "bounceInRight": "11", "bounceInUp": "12", "bounceInDown": "13", "bounceOut": "14", "bounceOutLeft": "15", "bounceOutRight": "16", "bounceOutUp": "17", "bounceOutDown": "18", "fadeIn": "19", "fadeInLeft": "20", "fadeInRight": "21", "fadeInUp": "22", "fadeInDown": "23", "fadeOut": "24", "fadeOutDown": "25", "fadeOutLeft": "26", "fadeOutRight": "27", "fadeOutUp": "28", "slideInUp": "29", "slideInDown": "30", "slideInLeft": "31", "slideInRight": "32", "slideOutUp": "33", "slideOutDown": "34", "slideOutLeft": "35", "slideOutRight": "36", "flipInY": "37", "flipOutY": "38", "lightSpeedIn": "39", "lightSpeedOut": "40", "zoomIn": "41", "zoomOut": "42", "rotateIn": "43", "rotateOut": "44" };
var type_effect = { 0: "none", 1: "bounce", 2: "flash", 3: "pulse", 4: "rubberBand", 5: "shake", 6: "swing", 7: "tada", 8: "wobble", 9: "bounceIn", 10: "bounceInLeft", 11: "bounceInRight", 12: "bounceInUp", 13: "bounceInDown", 14: "bounceOut", 15: "bounceOutLeft", 16: "bounceOutRight", 17: "bounceOutUp", 18: "bounceOutDown", 19: "fadeIn", 20: "fadeInLeft", 21: "fadeInRight", 22: "fadeInUp", 23: "fadeInDown", 24: "fadeOut", 25: "fadeOutDown", 26: "fadeOutLeft", 27: "fadeOutRight", 28: "fadeOutUp", 29: "slideInUp", 30: "slideInDown", 31: "slideInLeft", 32: "slideInRight", 33: "slideOutUp", 34: "slideOutDown", 35: "slideOutLeft", 36: "slideOutRight", 37: "flipInY", 38: "flipOutY", 39: "lightSpeedIn", 40: "lightSpeedOut", 41: "zoomIn", 42: "zoomOut", 43: "rotateIn", 44: "rotateOut" };

//==============================华丽分割线11====动画选项卡  end==================================

//==============================华丽分割线12====裁剪图片  begin==================================
function showImgCutDialog() {
    showDialogById('cutimg', 'cutImg');
    $("#radiolist td.r").show();
    var imgSrc = Contents.find('img').first().attr('src');
    openCrop(imgSrc);
    //打开后确保第一个默认选中
    $("#radiolist input[name=cropSize]").first().next('label')[0].click();;
    //绑定确定事件
    $("#cutimg  .qrxz a").unbind('click').bind('click', function () {
        goCropImg('cutImg');
    });
}
function hideImgCutDialog() {
    closeDialogAndMask('cutimg');
}

//==============================华丽分割线12====裁剪图片  end====================================

//==============================华丽分割线13====裁剪背景图  begin================================
function showBgImgCutDialog() {
    var imgSrc = $("#" + PhoneId + " .page-background").attr('bg-url');
    if (!imgSrc) {
        showTopTip("当前页还没有设置背景图~");
        return;
    }
    showDialogById('cutimg', 'cutBgImg');
    $("#radiolist td.r").hide();
    openCrop(imgSrc);
    jcropObj.setRatio(2 / 3);
    $("#cutimg  .qrxz a").unbind('click').bind('click', function () {
        goCropImg('cutBgImg');
    });
}
//==============================华丽分割线13====裁剪背景图  end====================================

//==============================华丽分割线14====版式  begin========================================
//显示版式面板
function showBanShi() {
    hideRightPanels();
    $("#edit_banshi").fadeIn();
    setTimeout(function () {
        getSingleTemplate($("#myTab2 li").eq(0));
    }, 300);
}
function hideBanShi() {
    $("#edit_banshi").hide();
}
//隐藏右侧所有的面板(样式、动画、版式等等)
function hideRightPanels() {
    hideYangShi_Ani();
    hideBanShi();
    hideEditBg();
    hideEditMusic();
    hideEditConfig();
    hideEditBg();
}
//确认应用版式  20151015 修改
function confirmUseTpl(o) {
    var id = 'infotc_del_3';
    showDialogById(id, 'deletePage');
    $("#" + id + " div.qrxx").unbind('click').bind('click', function () {
        doInsertPageTpl(o);
        closeDialogAndMask(id);
    });
    $("#" + id + " div.close").unbind('click').bind('click', function () {
        closeDialogAndMask(id);
        $(".Edit_left ul li.toDel").removeClass('toDel');;
    });
}
//插入新版式到页面  20151015 修改
function insertPageTpl(o) {
    confirmUseTpl(o);
}

//==============================华丽分割线14====版式  end==============================================

//==============================华丽分割线15====设置  begin============================================
function showEditConfig() {
    //initSetting();
    hideRightPanels();
    $("#edit_config").fadeIn();
}
function hideEditConfig() {
    $("#edit_config").hide();
}
//初始化设置面板
//function initSetting() {
//    //该方法在从数据库里读取数据后执行，把初始的数据信息绑定到对应的元素上
//    //写几个假的数据，代表从数据库读到的数值

//    var fengMian = "Edit_img/ad5.jpg";//封面
//    var title = "我的模板";
//    var description = "这里是描述，这里是描述，这里是描述，这里是描述，这里是描述，这里是描述";
//    var category = "个人";
//    var mscName = "春天在哪里.mp3";
//    var slideType = "上下翻页";
//    var whoSee = "所有人";

//    $("#fengMian").attr("src", fengMian);
//    $("#sceneTitle").val(title);
//    $("#sceneDesc").val(description);

//    $("#mscName").text(mscName);

//}
//裁剪封面  20151015
function showFMImgCutDialog(imgSrc) {
    showDialogById('cutimg', 'cutFMImg');
    $("#radiolist td.r").hide();
    openCrop(imgSrc);
    var ratio = parseFloat(118 / 169).toFixed(2);
    jcropObj.setRatio(ratio);
    $("#cutimg  .qrxz a").unbind('click').bind('click', function () {
        goCropImg('cutFMImg');
    });
}

//==============================华丽分割线15====设置  end============================================

//==============================华丽分割线16====美化单选复选  begin==================================
; (function ($) {
    //复选
    $.fn.hcheckbox = function (callback) {
        var self = this;
        var label = $(self).next("label").first();
        if ($(self).hide().is(":checked"))
            label.addClass('hCheckbox_checked');
        label.click(function (event) {
            if (!$(self).is(':checked')) {
                label.addClass('hCheckbox_checked');
                $(self).checked = true;
                callback(true);
            } else {
                label.removeClass('hCheckbox_checked');
                $(self).checked = false;
                callback(false);
            }
            event.stopPropagation();
        })
    }
    //单选
    $.fn.hradio = function (callback) {
        var self = this;
        return $(':radio+label', this).each(function () {
            $(this).addClass('hRadio');
            if ($(this).prev().is(":checked"))
                $(this).addClass('hRadio_Checked');
        }).click(function (event) {
            $(this).siblings().removeClass("hRadio_Checked");
            if (!$(this).prev().is(':checked')) {
                $(this).addClass("hRadio_Checked");
                $(this).prev()[0].checked = true;
                if ($(this).prev().is(':checked')) {
                    callback($(this).prev().val())
                }
            }
            event.stopPropagation();
        }).prev().hide();
    }
})(jQuery)
//==============================华丽分割线16====美化单选复选  end==================================

//==============================华丽分割线17====保存当前页、保存设置  begin========================
//保存提示
function saveTip() {
    var tip = "保存成功，如需让其他人看到还需<span style='font-size:20px;color:orange;'>发布</span>哦！";
    showTopTip(tip);
}


//判断当前页面是否修改
function isModify() {
    var oldHtml = window.oriHtml;
    var newHtml = $("#" + PhoneId).html();
    if (oldHtml == newHtml) {
        return true;
    }
    return false;
}

//==============================华丽分割线17====保存当前页、保存设置  end========================
//==============================华丽分割线18====获取json  begin==================================
//**************************************************************
//       获取一个页面的json，返回json对象    非常有用
//**************************************************************
function getSlideJson(slide) {
    var json = {
        "sceneId": window.sceneId,//新加,场景id
        "pageId": window.pageId,//新加,第几页
        "bgColor": getBgColor(),//新加，背景色
        "bgUrl": getBgImage(),
        "finger": {},
        "elements": []
    }
    //20160123 增加背景效果 增加这行
    if (getBgEffectType() != 0) json.bgEffect = getBgEffectType
    var boxs = slide.children(".el-box");//$("#" + PhoneId + " .el-box");
    boxs.each(function (i) {
        var box = $(this);
        json.elements.push(getBoxJson(box));
    });
    return json;
}
//获取一个元素json格式
function getBoxJson(box) {
    var mid = box.children('div.el-box-mid').first();
    var content = mid.children('div.el-box-contents').first();
    var ctype = content.attr("ctype");
    var id = content.attr("id");
    var json = {
        "id": "" + id,
        "ctype": ctype,
        "properties": {
            "ani": getAniJson(mid)           //20151025 旋转后动画bug
        },
        "css": getBoxCssJson(box),
        "mid": getMidJson(mid),
        "content": getContentJson(content)
    }
    return json;
}

//获取json格式动画信息
function getAniJson(box) {
    var effect = box.attr('swiper-animate-effect') ? box.attr('swiper-animate-effect') : "none";
    var duration = box.attr('swiper-animate-duration') ? box.attr('swiper-animate-duration') : "2s";
    var delay = box.attr('swiper-animate-delay') ? box.attr('swiper-animate-delay') : "0s";
    var count = box.attr('swiper-animate-count') ? box.attr('swiper-animate-count') : "1";
    var json = {
        "type": effect_type[effect],
        "duration": duration.split('s')[0],
        "delay": delay.split('s')[0],
        "count": count,
        "direction": ""
    }
    return json;
}
//获取json格式的style
function getBoxCssJson(box) {
    var json = {
        "width": justGetNum(box.css('width')),
        "height": justGetNum(box.css('height')),
        "left": box.css('left').split('p')[0], //20151017 修改
        "top": box.css('top').split('p')[0],   //20151017 修改
        "zIndex": box.css("z-index") == 'auto' ? '0' : box.css("z-index"),
        "transform": getRotateDeg(box)
    }
    return json;
}
//获取mid层的json
function getMidJson(mid) {
    var json = {
        "css": {
            "borderWidth": justGetNum(mid.css("border-width")),
            "borderStyle": mid.css('border-style'),
            "borderColor": rgbToRgba(mid.css("border-color")),
            "opacity": !mid[0].style.opacity ? 1 : mid[0].style.opacity,//  mid.css('opacity')  //20151216 透明度bug   
            "borderRadius": justGetNum(mid.css("border-radius")),
            "boxShadow": mid.css('box-shadow'),
            "backgroundColor": rgbToRgba(mid.css("background-color")),
            "paddingTop": justGetNum(mid.css('paddingTop'))
        }
    }
    return json;
}
//获取content层的json
function getContentJson(content) {
    var ctype = content.attr("ctype");
    var json = {}
    //图片
    if (ctype == 1) {
        json = {
            "css": {},
            "src": content.children('img').attr('src'),
            "contents": ""
        }
        //20160123 增加
        if (content.children("a.imgLink")[0]) {
            json.imgLink = content.children("a.imgLink")[0].href;
        }
    }
    else if (ctype == 2)//文字
        json = {
            "css": {
                "color": rgbToRgba(content.css("color")),
                "lineHeight": content[0].style.lineHeight,
                "fontFamily": content.css("font-family"),
                "textAlign": content.css("text-align"),
                "fontSize": content.css("font-size")
            },
            "src": "",
            "contents": content.html().trim()
        }
    else if (ctype == 3)//视频 20160123增加
    {
        if (content.children("a.video_btn")[0]) {
            json.videoUrl = content.children("a.video_btn").attr('videoUrl');
        }
    }
    else if (ctype == 501 || ctype == 502 || ctype == 503 || ctype == 504)//输入框 20160123增加
    {
        if (content.children("textarea")[0]) {
            json.placeholder = content.children("textarea").attr('placeholder');
        }
    }
    else if (ctype == 6)//提交按钮 20160123增加
    {
        if (content.children("button.form-submit")[0]) {
            json.btnName = content.children("button.form-submit").text();
        }
    }
    else if (ctype == 8)//拨号按钮 20160123增加
    {
        var $btn = json.btnName = content.children("a.tel-btn");
        if ($btn[0]) {
            json.btnName = $btn.text();
            json.tel = $btn.attr('href').split(':')[1];
        }
    }
    return json;
}
//只获取字符串中的数字
function justGetNum(str) {
    return str.replace(/[^0-9]/ig, "");
}
//获取背景色
function getBgColor() {
    return rgbToRgba($("#" + PhoneId + " .page-background").css("background-color"));
}
//获取背景图
function getBgImage() {
    var img = $("#" + PhoneId + " .page-background").attr("bg-url");
    if (!img) img = "";
    return img;
}
//获取背景图效果type  20160123 新增方法
function getBgEffectType() {
    var type = 0;
    var effectArr = ['', 'zoomUp', 'zoomDown'];
    var bgObj = $("#" + PhoneId + " .page-background");
    for (var i = 1; i < effectArr.length; i++) {
        if (bgObj.hasClass(effectArr[i])) type = i;
    }
    return type;
}
//==============================华丽分割线18====获取json  end====================================

//==============================华丽分割线19====解析json  begin==================================

//********************************************************************
//       解析一个页面的json，返回解析后的html对象（对象很重要！！！）   该方法非常有用
//********************************************************************
function getSlideHtmlByJson(json) {
    if (!json) return;
    var bgColor = json.bgColor;
    var bgurl = json.bgUrl;
    var elements = !json.elements ? new Array() : json.elements; //20151017
    var slide = $('<div class="swiper-slide swiper-slide-active"></div>');
    //20160123 修改begin
    var effectArr = ['', 'zoomUp', 'zoomDown'];
    var bgEffect = !json.bgEffect ? 0 : json.bgEffect;
    var bg = $('<div class="bgContainer"><div class="page-background ' + effectArr[bgEffect] + '" bg-url="' + bgurl + '" style="background-image: url(' + bgurl + '); background-color:' + bgColor + ';"></div></div>');
    //20160123 修改end
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
    if (parseInt(css.transform) > 0) {  //20151215 修改该分支
        var value = "rotateZ(" + css.transform + "deg)";
        box[0].style.transform = value;
        box[0].style.webkitTransform = value;
        box[0].style.mozTransform = value;
        box[0].style.msTransform = value;
        box[0].style.oTransform = value;
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
        //20160123 注释以下两行
        //contentBox.html(contentBox[0].innerText)
        //contentBox.html(contentBox[0].innerHTML.replace(/\n/g, "<br>"));
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
        contentBox.append('<textarea maxlength="300" placeholder="' + json.placeholder + '" name="form-input"></textarea><div class="el-mask"></div>');
    }
    else if (ctype == 6)//提交按钮 20160123增加
    {
        contentBox.append('<button class="form-submit">' + json.btnName + '</button><div class="el-mask"></div>');
    }
    else if (ctype == 8)//拨号按钮 20160123增加
    {
        contentBox.append('<a class="tel-btn" href="tel:' + json.tel + '">' + json.btnName + '</a><div class="el-mask"></div>');
    }
    return contentBox;
}
//==============================华丽分割线19====解析json  end====================================

//==============================华丽分割线20====load整个场景的全部页面  begin====================

//页面初始化时的一些参数
function setSetting(json) {
    window.sceneId = sceneId || json.sceneId;
    var fengmian = json.fengmian;
    var title = json.title;
    var desc = json.desc;
    var category = json.category;
    var bgMsc = json.bgMsc;
    var bgMscName = json.bgMscName || "请选择背景音乐";
    var slideType = json.slideType;
    var whoSee = json.whoSee;
    var autoPlay = parseInt(0 || json.autoPlay);// 20160123 自动播放，增加

    $("#fengMian").attr("src", fengmian);//封面
    $("#sceneTitle").val(title);
    $("#sceneDesc").val(desc);
    //$("#fenlei3").val(category);  //20151016    注释掉
    $("#stPlayer").attr("src", bgMsc).attr('data-name', bgMscName);
    $("#mscName").text(bgMscName);
    //$("#fenlei5").val(slideType);  //20151016   注释掉
    //$("#fenlei6").val(whoSee);     //20151016   注释掉
    if (autoPlay > 0) {              // 20160123 自动播放，增加
        $("#autoplaySwitch")[0].checked = true;
        $("#autoSpeed").show();
        $("#autoTime").val(parseInt(autoPlay / 1000));
    }
}
//==============================华丽分割线20====load整个场景的全部页面  end========================

//==============================华丽分割线21====左侧页面导航相关操作  begin========================
function initEdit_left() {
    pageListEvents();
    initSort();
    setActivePageByIndex(1);
    //initStack();
}
//创建左侧导航所有页面
function createLeftByJson(json) {
    var length = json.length;
    var ul = $("div.Edit_left ul");
    if (length == 0) { addOnePage(); return false; }
    for (var i = 0; i < length; i++) {
        var li_json = json[i].slide;
        var li = '<li>'
                + '<div class="num">' + (i + 1) + '</div>'
                + '<div class="pageList_content">'
                    + getSlideHtmlByJson(li_json)[0].outerHTML
                    + '<a class="copy" title="复制">复制</a><a class="del" title="删除">删除</a>'
                + '</div>'
            + ' </li>';
        ul.append(li);
    }
}
//页面导航事件监听
function pageListEvents() {
    $(".Edit_left ul li").each(function (i) {
        var li = $(this);
        pageListEvent(li);
    });
}
//页面导航事件监听
function pageListEvent(li) {
    li.bind('mouseup').bind('mouseup', function () {
        //setActivePage(li);//php里面没有注释，应该注释
    }).bind('mouseover').bind('mouseover', function () {
        li.addClass('li_hover');
    }).bind('mouseout').bind('mouseout', function () {
        li.removeClass('li_hover');
    });
    li.children("div.pageList_content").unbind('click').bind('click', function () {
        setActivePage(li);
    });
    var del = li.find("a.del");
    del.unbind('click').bind('click', function (e) {
        e.stopPropagation();
        deleteOnePage();
    });
    var copy = li.find("a.copy");
    copy.unbind('click').bind('click', function (e) {
        e.stopPropagation();
        copyOnePage();
    });
}
//初始化排序
function initSort() {
    var list = $(".Edit_left ul");
    list.sortable({
        placeholder: "ui-state-highlight",
        start: function (event, ui) {
            var li = ui.item;
            window.pageOldNum = li.children("div.num").text();
        },
        stop: function (event, ui) { },
        update: function (event, ui) {
            orderPageNum();
            //window.pageId = $("div.Edit_left div.pageList_content.active").siblings("div.num").text();//设置活动页的页码
            var li = ui.item;
            window.pageId = window.pageNewNum = li.children("div.num").text();
            saveNewSort(window.pageOldNum, window.pageNewNum)
        }
    });
    list.disableSelection();
}

//切换活动页
function setActivePage(li) {
    var pageCon = li.children("div.pageList_content");
    if (!pageCon.hasClass("active")) {
        //---------切换前先保存编辑好的页----重要---------
        //第一次进来没有活动页，所以加判断
        if ($(".Edit_left ul li").children("div.pageList_content.active")[0]) {
            updateSlide();//20151215 增加 切换活动页前先同步一下之前编辑的页和左侧导航里对应页
            savePage(false);
        }
        //------------------------------------------------
        window.pageId = li.children("div.num").text();//设置活动页的页码

        $("div.Edit_left div.pageList_content.active").removeClass("active");
        pageCon.addClass('active');
        var pageObj = pageCon.children(".swiper-slide").first();
        NowSlide = pageObj;
        var o = pageObj.clone();
        o.attr("id", PhoneId);
        Phone.replaceWith(o);
        initPhone();
        //隐藏右面板
        hideRightPanels();
        preventNavImgLink();//20160123 增加一行
        window.oriHtml = o.html();
    }
}
//设置当前活动页为指定的页码
function setActivePageByIndex(index) {
    if (index <= 1) index = 1;
    var li = $(".Edit_left ul li").eq(index - 1);
    setActivePage(li);
}

//确认删除一页弹窗
function confirmDelPage(type) {
    if (type != 1 && type != 2) { type = 1; }
    var id = 'infotc_del_' + type;
    showDialogById(id, 'deletePage');
    $("#" + id + " div.qrxx").unbind('click').bind('click', function () {
        doDeleteOnePage();
        closeDialogAndMask(id);
    });
    $("#" + id + " div.close").unbind('click').bind('click', function () {
        closeDialogAndMask(id);
        $(".Edit_left ul li.toDel").removeClass('toDel');;
    });
}
//删除一页
function deleteOnePage() {
    var li = $(".Edit_left ul li.li_hover").addClass('toDel');
    confirmDelPage(1);
}

//重新排列编号
function orderPageNum() {
    var list = $(".Edit_left ul li");
    list.each(function (i) {
        $(this).children(".num").text(i + 1);
    });
}
//下一页
function changeNext() {
    var next = $("div.Edit_left div.pageList_content.active").parent('li').next('li');
    if (!next[0]) {
        showTopTip("已经是最后一页了哦~");
    } else {
        setActivePage(next);
    }
}
//上一页
function changePrev() {
    var prev = $("div.Edit_left div.pageList_content.active").parent('li').prev('li');
    if (!prev[0]) {
        showTopTip("已经是第一页了哦~");
    } else {
        setActivePage(prev);
    }
}
//编辑后实时更新左侧活动的slide
function updateSlide() {
    var o = Phone.clone();
    o.removeAttr("id");
    o.find(".bar").remove();
    o.find(".ani").css({ 'animation': "", '-webkit-animation': "" }).attr("class", "el-box-mid ani"); //20151105
    o.children(".el-box-active").removeClass('el-box-active');
    NowSlide.replaceWith(o);
    NowSlide = $("div.Edit_left div.pageList_content.active").children(".swiper-slide").first();
}
//==============================华丽分割线21====左侧页面导航相关操作  end========================

//==============================华丽分割线22====保存、预览、发布  begin==========================
//保存全部
function saveAll() {
    //保存数据到数据库
    savePage(true);
    submitSetting(1);
}
//预览
function preview() {
    window.open("./preview/preview.html");
}

//==============================华丽分割线22====保存、预览、发布  end==============================
//==============================华丽分割线23====滤镜  begin========================================
//设置滤镜对象
function setLvJingObj() {
    var img = Contents.children('img').first();
    var imgobj = img[0];
    if (imgobj.complete) {
        LvJingObj = new LvJing(imgobj);
    } else {
        img.unbind('load').bind('load', function () {
            LvJingObj = new LvJing(imgobj);
            img.unbind('load')
        });
    }
}
//绑定滤镜点击事件
function bindLvJingClick() {
    var filters = $("#edit_style_ani ul.texiao>li");
    filters.unbind('click').bind('click',
        function (e) {
            e.preventDefault();
            var f = $(this);
            if (f.is('.active')) { return false; }
            filters.removeClass('active');
            f.addClass('active');
            var img = f.children("img").first();
            var effect = $.trim(img.attr("data-effect"));
            LvJingObj.useEffect(effect, {
                "succese": function (src) {
                    //console.log(src);
                    replaceImg(src);
                }
            });
        });
}
//==============================华丽分割线23====滤镜  end========================================

//==============================华丽分割线24====层级关系  begin================================== // 20151105  增加
//获取最大的z-index
function getMaxZIndex() {
    return Phone.children('.el-box').length;
}
//更新所有index
function updateIndex() {
    Phone.children('.el-box').each(function (i) {
        $(this).css('z-index', (i + 1));
    });
}
//上移一层
function shangyi() {
    try { window.event.stopPropagation(); }
    catch (e) { }
    var next = NowBox.next('.el-box');
    if (next[0]) {
        NowBox.insertAfter(next);
        updateIndex();
    }
}
//下移一层
function xiayi() {
    try { window.event.stopPropagation(); }
    catch (e) { }
    var prev = NowBox.prev('.el-box');
    if (prev[0]) {
        NowBox.insertBefore(prev);
        updateIndex();
    }
}
//置顶
function zhiding() {
    try { window.event.stopPropagation(); }
    catch (e) { }
    var last = Phone.children('.el-box').last();
    if (last[0]) {
        NowBox.insertAfter(last);
        updateIndex();
    }
}
//置底
function zhidi() {
    try { window.event.stopPropagation(); }
    catch (e) { }
    var first = Phone.children('.el-box').first();
    if (first[0]) {
        NowBox.insertBefore(first);
        updateIndex();
    }
    NowBox.find(".ani").css({ 'animation': " ", '-webkit-animation': " " });
}
//==============================华丽分割线24====z-index  end=====================================

//==============================华丽分割线25====键盘控制移动  begin============================== //20151215
//键盘控制
function KeyboardMove() {
    var _this = this;
    this.obj = '', this.canMove = true, this.step = 1;
    this.keydown = function () {
        document.onkeydown = function (ev) {
            if (!_this.canMove) return;
            if (!_this.obj) return;
            var ev = ev || event;
            if (ev.keyCode == 37) _this.obj.style.left = _this.obj.offsetLeft - _this.step + 'px';
            else if (ev.keyCode == 38) _this.obj.style.top = _this.obj.offsetTop - _this.step + 'px';
            else if (ev.keyCode == 39) _this.obj.style.left = _this.obj.offsetLeft + _this.step + 'px';
            else if (ev.keyCode == 40) _this.obj.style.top = _this.obj.offsetTop + _this.step + 'px';
        }
    }
    this.keydown();
}
var kbMove = new KeyboardMove();
//获取焦点后，键盘不可控制移动
function focus() {
    kbMove.canMove = false;
}
//失去焦点后，键盘开启控制移动
function blur() {
    kbMove.canMove = true;
}
//绑定文本框获取焦点和失去焦点
function bindFocusBlur(dom) {
    dom.onfocus = focus;
    dom.onblur = blur;
}
/**
 * 页面里面所有的输入框都绑定上控制是否可移动的事件，
 * 防止输入框获取焦点后同样可以移动元素的问题
 */
function inputfocus() {
    $("input[type=number]").each(function () {
        bindFocusBlur(this);
    });
}
//==============================华丽分割线25====键盘控制移动  end================================
//==============================华丽分割线26====右键菜单方法集 begin============================= //20151215
//右键-编辑
function popMenu_Edit() {
    hidePopMenu200();
    if (Ctype == 1) {
        showImgReplaceDialog();
        initSourceImg();
    }
    else if (Ctype == 2) {
        closeDrag(NowBox);
        kbMove.canMove = false;
        showBtnToolbar(Contents);
    } else if (Ctype == 3) {//20160123  增加该分支
        showEditVideo();
    } else if (Ctype == 501 || Ctype == 502 || Ctype == 503 || Ctype == 504) {//20160123  增加该分支
        showEditInput();
    } else if (Ctype == 6) {//20160123  增加该分支
        showEditSubmitBtn();
    } else if (Ctype == 8) {//20160123  增加该分支
        showEditTelBtn();
    }
}
//右键-样式
function popMenu_Style() {
    showYangShi_Ani(1);
    hidePopMenu200();
}
//右键-动画
function popMenu_Animate() {
    showYangShi_Ani(2);
    hidePopMenu200();
}
//右键-复制
function popMenu_Copy() {
    copyData = NowBox.clone();
    hidePopMenu200();
}
//右键-粘贴
function popMenu_Paste() {
    hidePopMenu200();
    var top = parseFloat(copyData.css("top").split('p')[0]);
    var zIndex = getMaxZIndex() + 1;
    copyData.css({ "top": top + 20, "z-index": zIndex });
    copyData.find(".bar").remove();
    var newBox = copyData.clone();
    newBox.removeClass('el-box-active');
    Phone.append(newBox);
    initElBox(newBox);
    newBox.trigger('mousedown');
    showYangShi_Ani(1);
    updateSlide();
}
//右键-删除
function popMenu_Delete() {
    deleteBox();
    hidePopMenu200();
}
//右键-裁剪
function popMenu_Cut() {
    showImgCutDialog();
    hidePopMenu200();
}
//右键-置顶
function popMenu_ToTop() {
    zhiding();
}
//右键-置底
function popMenu_ToBottom() {
    zhidi();
}
//右键-上移一层
function popMenu_ToUp() {
    shangyi();
}
//右键-下移一层
function popMenu_ToDown() {
    xiayi();
}
//右键-链接 20160123 新增方法
function popMenu_Link() {
    showAddImgLink();
    hidePopMenu200();
}
//==============================华丽分割线26====右键菜单方法集 end===============================
//==============================华丽分割线27====文字工具：富文本编辑器 begin=====================
$(function () {
    //防止点击超链接输入框时隐藏
    function initToolbarBootstrapBindings() {
        //$('a[title]').tooltip({ container: 'body' });
        $('.dropdown-menu input').click(function () { return false; })
        .change(function () { $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); })
        .keydown('esc', function () { this.value = ''; $(this).change(); });
    };
    initToolbarBootstrapBindings();
    $("#btn-toolbar .btn:not(.dropdown-toggle)").click(function () {
        updateSlide();
    });
    $("#btn-toolbar ul.dropdown-menu li a:not(.btn)").click(function () {
        //updateSlide();
    });
});
//显示文字工具条
function showBtnToolbar(jq) {
    if (jq.attr('contenteditable') == 'true') return;
    $("div.el-box-contents[contenteditable]").removeAttr('contenteditable');
    jq.wysiwyg();
    var t = jq.offset().top - ((jq[0].offsetHeight - jq.height()) / 2);
    if ($("#btn-toolbar").css('display') == 'none')
        $("#btn-toolbar").show();
    $("#btn-toolbar").css('top', (t - 40) + 'px');
    jq[0].focus();
    selectAllText();
}
//隐藏文字工具条
function hideBtnToolBar() {
    $("div.el-box-contents[contenteditable]").removeAttr('contenteditable');
    $("#btn-toolbar").hide();
}
//退出文字工具条，并进行退出后的还原现场
function exitFontEdit() {
    var con = $("#" + PhoneId + " div.el-box-contents[contenteditable]");
    if (con[0]) {
        openDrag(con.parents(".el-box"));
        con.find("a").unbind("click").bind("click", function () { return false; });
        kbMove.canMove = true;
        hideBtnToolBar();
    }
}
//减小行距
function lineHeightDown() {
    var o = Contents[0];
    var lh = parseFloat(o.style.lineHeight);
    o.style.lineHeight = lh - 0.1;
    updateSlide();
}
//增大行距
function lineHeightUp() {
    var o = Contents[0];
    var lh = parseFloat(o.style.lineHeight);
    o.style.lineHeight = lh + 0.1;
    updateSlide();
}
//对齐方式
function textAlign(value) {
    var o = Contents[0];
    o.style.textAlign = value;
    updateSlide();
}
//全选文字
function selectAllText() {
    if (window.getSelection) {
        var sel = window.getSelection();
        sel.modify('move', 'left', 'documentboundary');
        sel.modify('extend', 'right', 'documentboundary');
    }
}
//==============================华丽分割线27====文字工具：富文本编辑器 end=======================
//==============================华丽分割线28====图片加超链 begin=================================20160123 增加模块
//显示添加链接弹窗
function showAddImgLink() {
    var href = "http://";
    var a = Contents.find("a.imgLink").first();
    if (a[0]) {
        href = a[0].href;
    }
    $("#imgLinkInput").val(href);
    $("#linkError").hide();
    showDialogById("addImgLink");
}
//确认添加链接
function addImgLink() {
    var href = $("#imgLinkInput").val();
    if (IsURL(href)) {
        var a = Contents.find('a');
        if (a[0])
            a[0].href = href;
        else
            Contents.append('<a href="' + href + '" class="imgLink"></a>')
        closeDialogAndMask('addImgLink');
        preventImgLink();
    } else {
        $("#linkError").show();
    }
}
//验证是否为网址
function IsURL(str_url) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    + "|" // 允许IP和DOMAIN（域名）
    + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
    + "[a-z]{2,6})" // first level domain- .com or .museum
    + "(:[0-9]{1,4})?" // 端口- :80
    + "((/?)|" // a slash isn't required if there is no file name
    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    //re.test()
    if (re.test(str_url)) {
        return (true);
    } else {
        return (false);
    }
}
//禁用手机区域内所有的图片超链的跳转（调用时机：1.每次初始化手机容器后，2.添加新的链接后）
function preventImgLink() {
    Phone.find("a.imgLink").unbind('click').click(function (e) {
        e.preventDefault();
    });
}
//禁用导航区域内所有的超链的跳转
function preventNavImgLink() {
    $("div.swiper-slide a").unbind('click').click(function (e) {
        e.preventDefault();
    });
}
//==============================华丽分割线28====图片加超链 end===================================
//==============================华丽分割线29====视频模块 begin=================================20160123 增加模块
//显示添加视频弹窗
function showAddVideo() {
    var videoUrl = "";
    $("#video_src").val(videoUrl);
    $("#addVideo .qrxx").unbind().click(addVideoToScene);
    $("#videoError").hide();
    showDialogById("addVideo");
    $(".video_src")[0].focus();
}
//显示编辑视频弹窗
function showEditVideo() {
    var videoUrl = Contents.find("a.video_btn").attr("videoUrl");
    $("#video_src").val(videoUrl);
    $("#addVideo .qrxx").unbind().click(editVideo);
    $("#videoError").hide();
    showDialogById("addVideo");
    $(".video_src")[0].focus();
}
//确认添加视频
function addVideoToScene() {
    var videoUrl = $("#video_src").val();
    var flag = checkVideoUrl(videoUrl);
    if (!flag) {
        $("#videoError").show();
        return;
    }
    videoUrl = videoUrl.replace(/"/ig, "'");
    var id = new Date().getTime();
    var elBox = $('<div class="el-box" style="width:50px;height:50px;position:absolute;left:135px;top:215px;z-index:' + (getMaxZIndex() + 1) + ';"></div>');
    var d = $('<div class="el-box-mid ani"></div>');
    var cts = $('<div id=' + id + ' class="el-box-contents" ctype="3"></div>');
    var vBtn = $('<a class="video_btn"></a>');
    vBtn.attr("videoUrl", videoUrl);
    Phone.append(elBox);
    elBox.append(d);
    d.append(cts);
    cts.append(vBtn);
    initElBox(elBox);
    elBox.trigger('mousedown');
    updateSlide();
    closeDialogAndMask('addVideo');
}
//确认编辑视频地址
function editVideo() {
    var videoUrl = $("#video_src").val();
    var flag = checkVideoUrl(videoUrl);
    if (!flag) {
        $("#videoError").show();
        return;
    }
    videoUrl = videoUrl.replace(/"/ig, "'");
    Contents.find("a.video_btn").attr("videoUrl", videoUrl);
    closeDialogAndMask('addVideo');
    updateSlide();
}
//检查视频格式是否正确
function checkVideoUrl(videoUrl) {
    var myReg = "^.+(http://)(player.youku.com|www.tudou.com|v.qq.com).+$";
    var re = new RegExp(myReg);
    if (re.test(videoUrl))
        return true;
    else
        return false;
}
//==============================华丽分割线29====视频模块 end===================================
//==============================华丽分割线30====表单-输入框 begin==============================20160123
function initInputDialogRadio() {
    //输入框弹窗单选20160123
    $('#addInput input').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red',
        increaseArea: '20%' // optional
    });
    $('#addInput input').on('ifChecked', function (event) {
        var nameArr = ['请输入', '姓名', '手机', '邮箱'];
        var text = nameArr[parseInt($(this).attr('data-type')) % 500 - 1];
        $("#input-name").val(text);;
    });
}
//显示添加输入框弹窗
function showAddInput() {
    $("#input-name").val('请输入');
    $('#addInput input[data-type="501"]').iCheck('check');
    $("#addInput .color-contain span a").first()[0].click()
    $("#addInput .qrxx").unbind().click(addInputToScene);
    showDialogById("addInput");
    $("#input-name")[0].focus();
}
//显示编辑输入框弹窗
function showEditInput() {
    $("#input-name").val(Contents.find('textarea').attr('placeholder'));
    $('#addInput input[data-type="' + Ctype + '"]').iCheck('check');
    var borderColor = MidBox.css('border-color');
    $("#addInput .color-contain span").removeClass('selected');
    $("#addInput .color-contain span a").each(function () {
        if ($(this).css('background-color') == borderColor)
            $(this).parents('span').first().addClass('selected');
    });
    $("#addInput .qrxx").unbind().click(editInput);
    showDialogById("addInput");
    $("#input-name")[0].focus();
}
//确认添加输入框
function addInputToScene() {
    var inputName = $("#input-name").val().trim();
    var inputType = $('#addInput input[name="input-type"]:checked').attr('data-type');
    var bgColor = $("#addInput span.selected a").css('background-color');
    var id = new Date().getTime();
    var elBox = $('<div class="el-box" style=width:200px;height:40px;position:absolute;left:60px;top:60px;z-index:' + (getMaxZIndex() + 1) + ';"></div>');
    var d = $('<div class="el-box-mid ani" style="border:1px solid ' + bgColor + ';background-color:rgb(255,255,255);"></div>');
    var cts = $('<div id=' + id + ' class="el-box-contents" ctype="' + inputType + '"></div>');
    var input = $('<textarea maxlength="300" placeholder="' + inputName + '" name="form-input"></textarea>');
    var imask = $('<div class="el-mask"></div>');
    Phone.append(elBox);
    elBox.append(d);
    d.append(cts);
    cts.append(input);
    cts.append(imask);
    initElBox(elBox);
    elBox.trigger('mousedown');
    updateSlide();
    closeDialogAndMask('addInput');
}
//确认编辑输入框
function editInput() {
    var inputName = $("#input-name").val().trim();
    var inputType = $('#addInput input[name="input-type"]:checked').attr('data-type');
    var bgColor = $("#addInput span.selected a").css('background-color');
    Contents.find('textarea').attr('placeholder', inputName);
    Contents.attr('ctype', inputType);
    Ctype = inputType;
    MidBox.css('border-color', bgColor);
    var borderColor = rgbToRgba(MidBox.css("border-color"));
    setBorderColor($("#borderColorEdit"), borderColor);
    closeDialogAndMask('addInput');
    updateSlide();
}
//改变输入框的边框色
function changeSelectedColor(_this) {
    var $span = $(_this).parents('span').first();
    if (!$span.hasClass('selected'))
        $span.addClass('selected').siblings('.selected').removeClass('selected');
}
//==============================华丽分割线30====表单-输入框 end================================
//==============================华丽分割线31====表单-提交按钮 begin============================20160123
//显示添加提交按钮弹窗
function showAddSubmitBtn() {
    $("#submit-name").val('提交信息');
    $("#addSubmitBtn .color-contain span a").first()[0].click()
    $("#addSubmitBtn .qrxx").unbind().click(addSubmitBtnToScene);
    showDialogById("addSubmitBtn");
    $("#submit-name")[0].focus();
}
//显示编辑提交按钮弹窗
function showEditSubmitBtn() {
    $("#submit-name").val(Contents.find('button').text());
    var bgColor = MidBox.css('background-color');
    $("#addSubmitBtn .color-contain span").removeClass('selected');
    $("#addSubmitBtn .color-contain span a").each(function () {
        if ($(this).css('background-color') == bgColor)
            $(this).parents('span').first().addClass('selected');
    });
    $("#addSubmitBtn .qrxx").unbind().click(editSubmitBtn);
    showDialogById("addSubmitBtn");
    $("#submit-name")[0].focus();
}
//确认添加提交按钮
function addSubmitBtnToScene() {
    if ($('.Edit_left button.form-submit').length >= 1) {
        showTopTip('每个场景只能加一个提交按钮！');
        return false;
    }
    var submitName = $("#submit-name").val().trim();
    var bgColor = $("#addSubmitBtn span.selected a").css('background-color');
    var id = new Date().getTime();
    var elBox = $('<div class="el-box" style=width:200px;height:40px;position:absolute;left:60px;top:60px;z-index:' + (getMaxZIndex() + 1) + ';"></div>');
    var d = $('<div class="el-box-mid ani" style="background-color:' + bgColor + ';"></div>');
    var cts = $('<div id=' + id + ' class="el-box-contents" ctype="6"></div>');
    var input = $('<button class="form-submit">' + submitName + '</button>');
    var imask = $('<div class="el-mask"></div>');
    Phone.append(elBox);
    elBox.append(d);
    d.append(cts);
    cts.append(input);
    cts.append(imask);
    initElBox(elBox);
    elBox.trigger('mousedown');
    updateSlide();
    closeDialogAndMask('addSubmitBtn');
}
//确认编辑提交按钮
function editSubmitBtn() {
    var submitName = $("#submit-name").val().trim();
    var bgColor = $("#addSubmitBtn span.selected a").css('background-color');
    Contents.find('button').text(submitName);
    MidBox.css('background-color', bgColor);
    var bgColor = rgbToRgba(MidBox.css("background-color"));
    setElBgColor($("#bgColorEdit"), bgColor);
    closeDialogAndMask('addSubmitBtn');
    updateSlide();
}
//保存所有表单项的名字，便于后台生成对应的表格，此方法与提交按钮没关，只是写到这里面了
function saveFormNames() {
    var nameArr = [];
    $('.Edit_left textarea[name="form-input"]').each(function () {
        var $this = $(this);
        //var type = $this.parent('.el-box-contents').attr('ctype');
        var name = $this.attr('placeholder');
        nameArr.push(name);
    });    
    //post到后台
    postFormNames(nameArr);
}
//==============================华丽分割线31====表单-提交按钮 end==============================
//==============================华丽分割线32====表单-一键拨号 begin============================20160123
//显示添加拨号按钮弹窗
function showAddTelBtn() {
    $("#telBtn-name").val('一键拨号');
    $('#telBtn-number').val('');
    $("#addTelBtn .color-contain span a").first()[0].click()
    $("#addTelBtn .qrxx").unbind().click(addTelBtnToScene);
    showDialogById("addTelBtn");
    $("#telBtn-name")[0].focus();
    $('#addTelBtn .error-info').hide();
}
//显示编辑拨号按钮弹窗
function showEditTelBtn() {
    var $telBtn = Contents.find('a.tel-btn');
    $("#telBtn-name").val($telBtn.text());
    var number = $telBtn.attr('href').split(':')[1];
    $('#telBtn-number').val(number);
    var bgColor = MidBox.css('background-color');
    $("#addTelBtn .color-contain span").removeClass('selected');
    $("#addTelBtn .color-contain span a").each(function () {
        if ($(this).css('background-color') == bgColor)
            $(this).parents('span').first().addClass('selected');
    });
    $("#addTelBtn .qrxx").unbind().click(editTelBtn);
    showDialogById("addTelBtn");
    $("#telBtn-name")[0].focus();
    $('#addTelBtn .error-info').hide();
}
//确认添加拨号按钮
function addTelBtnToScene() {
    var submitName = $("#telBtn-name").val().trim();
    var number = $('#telBtn-number').val();
    $('#addTelBtn .error-info').hide();
    if (submitName == '') { $("#telBtn-name").next('.error-info').show(); return false; }
    if (number == '') { $("#telBtn-number").next('.error-info').show(); return false; }
    var bgColor = $("#addTelBtn span.selected a").css('background-color');
    var id = new Date().getTime();
    var elBox = $('<div class="el-box" style=width:100px;height:30px;position:absolute;left:110px;top:350px;z-index:' + (getMaxZIndex() + 1) + ';"></div>');
    var d = $('<div class="el-box-mid ani" style="background-color:' + bgColor + ';"></div>');
    var cts = $('<div id=' + id + ' class="el-box-contents" ctype="8"></div>');
    var elm = $('<a class="tel-btn" href="tel:' + number + '">一键拨号</a>');
    var imask = $('<div class="el-mask"></div>');
    Phone.append(elBox);
    elBox.append(d);
    d.append(cts);
    cts.append(elm);
    cts.append(imask);
    initElBox(elBox);
    elBox.trigger('mousedown');
    updateSlide();
    closeDialogAndMask('addTelBtn');
}
//确认编辑拨号按钮
function editTelBtn() {
    var submitName = $("#telBtn-name").val().trim();
    var number = $('#telBtn-number').val();
    $('#addTelBtn .error-info').hide();
    if (submitName == '') { $("#telBtn-name").next('.error-info').show(); return false; }
    if (number == '') { $("#telBtn-number").next('.error-info').show(); return false; }
    var bgColor = $("#addTelBtn span.selected a").css('background-color');
    Contents.find('a.tel-btn').text(submitName).attr('href', 'tel:' + number);
    MidBox.css('background-color', bgColor);
    var bgColor = rgbToRgba(MidBox.css("background-color"));
    setElBgColor($("#bgColorEdit"), bgColor);
    closeDialogAndMask('addTelBtn');
    updateSlide();
}
//==============================华丽分割线32====表单-一键拨号 end==============================20160123

