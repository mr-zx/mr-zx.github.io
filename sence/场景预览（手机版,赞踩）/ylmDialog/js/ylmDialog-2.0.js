/*!
 @Name：ylmDialog v2.0 弹层组件
 @Author：张旭
 @Time: 2015.10.21
 @modify：将div封装到Js里
**/
var YlmDialog = {
    inArr: ['bounceInDown', 'zoomIn'],
    outArr: ['bounceOutUp', 'zoomOut'],
    inAni: "",
    outAni: "",
    o: "",
    cancel: "",
    open: function (options) {
        //var options = {
        //    msg: "操作成功啦~~~",                           // 弹窗显示内容，必须
        //    type: "1",                                      // type：1：成功，2：警告，3：失败 //非必须，默认1
        //    aniType: 1,                                     // 动画类型：默认 0，可选0、1， 非必须
        //    timeColse: 200,                                 // 定时关闭（有关闭按钮时，此参数失效），非必须
        //    shadeClose: true,                               // 点击遮罩是否关闭，默认 true ，非必须
        //    cancel: function () { },                        // 弹窗关闭后，执行的操作 ，非必须
        //    btn: ["取消", "确定"],                          // 按钮数组，非必须
        //    btnFun: [function () { }, function () { }]      // 每个按钮对应的点击方法，和上面按钮数对应起来
        //};
        var type = typeof options.type == 'undefined' ? 1 : options.type;
        var msg = !options.msg ? "写点什么吧" : options.msg;
        var aniType = isNaN(options.aniType) || options.aniType > 1 ? 0 : options.aniType;
        var timeColse = !options.timeColse ? 500 : options.timeColse;
        var shadeClose = typeof options.shadeClose == 'undefined' ? true : options.shadeClose;
        YlmDialog.cancel = !options.cancel ? function () { } : options.cancel;
        var btnArr = typeof options.btn == 'undefined' ? new Array() : options.btn;
        var btnFun = typeof options.btnFun == 'undefined' ? new Array() : options.btnFun;

        showDialogByBtn(type, msg, btnArr, btnFun);
        var id = "ylmDialog_id_" + type;
        var o = $("#" + id);
        YlmDialog.o = o;
        o.removeClass('ylmDialog').addClass('ylmDialog');
        $(".ylmDialog").hide();
        YlmDialog.inAni = YlmDialog.inArr[aniType];
        YlmDialog.outAni = YlmDialog.outArr[aniType];
        var inAni = YlmDialog.inAni;
        var outAni = YlmDialog.outAni;

        //------黑色半透明遮罩--begin
        if (!$(".maskBg")[0]) {
            var mask = '<div class="maskBg"></div>';
            $('body').append(mask);
            $(".maskBg").bind('touchmove', function (e) {
                e.preventDefault(); e.stopPropagation();
            });
        }
        $(".maskBg").fadeIn(500).unbind('click');
        if (shadeClose)
            $(".maskBg").bind('click', function () {
                YlmDialog.close();
            });
        //------黑色半透明遮罩--end
        //关闭按钮 begin
        var closeBtn = o.find('.close');
        if (!closeBtn[0]) {
            var tid = window.setTimeout(function () {
                YlmDialog.close();
                clearTimeout(tid);
            }, parseInt(timeColse) + 500);
        } else {
            closeBtn.unbind('click').bind('click', function () {
                YlmDialog.close();
            });
        }
        //关闭按钮 end
        o.css('z-index', parseInt($(".maskBg").css('z-index')) + 10);
        o.show().addClass("animated " + inAni).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass("animated " + inAni + " " + outAni);
        }).bind('touchmove', function (e) {
            e.preventDefault(); e.stopPropagation();
        });
    },
    close: function () {
        $(".maskBg").fadeOut(500);
        var inAni = YlmDialog.inAni;
        var outAni = YlmDialog.outAni;
        var o = YlmDialog.o;
        o.removeClass("animated " + inAni + " " + outAni).addClass("animated " + outAni).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            o.remove();
            YlmDialog.cancel();
        });
    },
    closeAll: function () {
        $(".maskBg").fadeOut(500);
        $(".ylmDialog").hide();
    }
}

//根据按钮数量显示对应弹窗
function showDialogByBtn(type, msg, btnArr, btnFun) {
    if (btnArr.length == 2) {
        var btn1 = btnArr[0], btn2 = btnArr[1];
        var btnFun1 = !btnFun[0] ? function () { } : btnFun[0];
        var btnFun2 = !btnFun[1] ? function () { } : btnFun[1];
        showDialog2Btn(type, msg, btn1, btn2, btnFun1, btnFun2);
    } else if (btnArr.length == 1) {
        var btn1 = btnArr[0];
        var btnFun1 = !btnFun[0] ? function () { } : btnFun[0];
        showDialog1Btn(type, msg, btn1, btnFun1);
    } else {
        showDialog0Btn(type, msg);
    }
}
//2个按钮
function showDialog2Btn(type, msg, btn1, btn2, btnFun1, btnFun2) {
    //type：1：成功，2：警告，3：失败
    var id = "ylmDialog_id_" + type;
    var html = ""
    + '<div id="' + id + '" class="Popup_a">'
        + '<h1><img src="ylmDialog/images/cgxl_' + type + '.png" /></h1>'
        + '<h2>' + msg + '</h2>'
        + '<ul class="lganiu">'
            + '<li><a>' + btn1 + '</a></li>'
            + '<li><a class="z1">' + btn2 + '</a></li>'
        + '</ul>'
        + '<div class="btn close"><img src="ylmDialog/images/close.png" /></div>';
    +'</div>';
    $('body').append(html);
    var li = $("#" + id + " ul.lganiu li");
    li.eq(0).unbind('click').bind('click', btnFun1);
    li.eq(1).unbind('click').bind('click', btnFun2);
    return html;
}
//一个按钮
function showDialog1Btn(type, msg, btn1, btnFun1) {
    //type：1：成功，2：警告，3：失败
    var id = "ylmDialog_id_" + type;
    var html = ""
    + '<div id="' + id + '" class="Popup_a">'
        + '<h1><img src="ylmDialog/images/cgxl_' + type + '.png" /></h1>'
        + '<h2>' + msg + '</h2>'
        + '<div class="qdan">'
            + '<a>' + btn1 + '</a>'
        + '</div>'
        + '<div class="btn close"><img src="ylmDialog/images/close.png" /></div>'
    + '</div>';
    $('body').append(html);
    $("#" + id + " div.qdan").unbind('click').bind('click', btnFun1);;
    return html;
}
//0个按钮
function showDialog0Btn(type, msg) {
    //type：1：成功，2：警告，3：失败
    var id = "ylmDialog_id_" + type;
    var html = ""
    + '<div id="' + id + '" class="Popup_b">'
        + '<table width="100%" border="0" cellpadding="0" cellspacing="0">'
            + '<tr>'
                + '<td width="200" align="right"><img src="ylmDialog/images/cgxl_' + type + '.png" /></td>'
                + '<td>' + msg + '</td>'
            + '</tr>'
        + '</table>'
    + '</div>';
    $('body').append(html);
    return html;
}