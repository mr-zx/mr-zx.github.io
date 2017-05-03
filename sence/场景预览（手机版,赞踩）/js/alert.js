/**
 * 弹窗效果
 * content:需要弹出的内容，可以是html 
 * style：弹窗的样式，可自定义
 **/
var layerActNum = 0;//活动的弹窗数
function alertPage(contentObj, style) {
    var index = '';
    layer.closeAll();
    style = style == null ? 'max-width:610px;' : style;
    var closeBtnHtml = '<div id="dialogCloseBtn' + layerActNum + '" style="position:absolute;right:-20px;top:-20px;z-index:99999;"><img src="js/layer.mobile/img/dialogCloseBtn.png" style="width:80px;" /></div>';
    var o = layer.open({
        type: 1,
        content: '',
        style: style,
        shade: true,
        shadeClose: true,
        anim: true,
        success: function (elem) {
            $(".layermcont").append(contentObj.show());
//            $(elem).find('.layermanim').first().append(closeBtnHtml);
            index = elem.id.split('box')[1];
            //sdocument.getElementById("dialogCloseBtn" + layerActNum).onclick = function () { layer.close(index); }
            layerActNum++;
            //禁止阴影的滑动关闭事件
            $(elem).children('.laymshade').first().attr('ontouchmove', '').unbind('touchmove');
            //$(elem).bind("touchmove", function (e) {
            //    e.preventDefault();
            //});
            //$(elem).bind("touchmove", function (e) {
            //    e.stopPropagation();
            //});

            closeBodyScr();
            contentObj.bind("touchmove", function (e) {
                //console.log(12);
                e.stopPropagation();
            });
            return index;
        },
        end: function () {
            layerActNum--;
            $('body').append(contentObj.hide());
            openBodyScr();
        }
    });
    return o;
}
function DialogLayer(btnID, ctnID) {
    $("#" + btnID).click(function () { alertPage($("#" + ctnID)); });
}
//打开id为ctnID的弹窗
function openDialogLayer(ctnID) { alertPage($("#" + ctnID)); }
//弹窗，type：0错误提示，1：成功提示
function alertTip(msg, type, time, toUrl) {
    $("#alert_Div").remove();
    var inobj = new Object();
    if (type == 1) {
        inobj = $('<div id="alert_Div" style="display: none;"><p><img src="images/okMark.png"/></p><p style="color:#008c60;font-size:40px;margin-top:80px;">' + msg + '</p></div>');
    } else if (type == 0) {
        inobj = $('<div id="alert_Div" style="display: none;"><p><img src="images/noMark.png"/></p><p style="color:#008c60;font-size:40px;margin-top:80px;">' + msg + '</p></div>');
    }
    $('body').append(inobj);
    var index = alertPage($("#alert_Div"));
    var i = 0
    if (time != '' && parseInt(time) > 0) {
        var tid = setInterval(function () {
            i++;
            if (i >= time) {
                clearInterval(tid);
                layer.close(index);
                if (toUrl != '') {
                    window.location = toUrl;
                }
            }
        }, 1000);
    }
}
//禁用body滚动
var n = 1;
function closeBodyScr() {
    $("body").css("overflow", "hidden");
    $('body').bind("touchmove", function (e) {
        e.preventDefault();
    });
}
//开启body滚动
function openBodyScr() {
    $("body").css("overflow", "auto");
    $("body").unbind("touchmove");
}