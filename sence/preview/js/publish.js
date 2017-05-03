/**
 * 入口：页面初始化的工作放到这个里面
 **/
$(function () {
    prettySelect();
    getAllSlidesJson();
});

window.direction = "vertical";//翻页方式
//初始化页面，获取页面json后执行
function initPage() {
    //初始化swiper和动画
    initSwiper({ 'id': 'swiper-container' });
    //背景音乐初始化
    initBgMusic();
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

//设置方向
function setDirection(desc) {
    var direc = "vertical";
    if (desc == "1") {
        direc = "vertical";
        $("#array").show();
        $("#arrayR,#arrayL").hide();
    } else if (desc == "2") {
        direc = "horizontal";
        $("#array").hide();
        $("#arrayR,#arrayL").show();
    }
    window.direction = direc;
}
//全局变量
var jcropObj;
var jcropRatios = [0, 1 / 1, 4 / 3, 3 / 4, 2 / 3, 1.32, 1.98, 0];

// 美化下拉列表 新增方法 20151105
function prettySelect() {
    $("select").each(function () {
        var id = $(this).attr("id");
        if (id) {
            if (id == "fenlei5")
                selectPretty(id, function (value) { changeSlideType(value); });
            else selectPretty(id, function (value) { });
        }
    });
}

function nTabs(thisObj, Num) {
    if (thisObj.className == "current") return;
    var tabObj = thisObj.parentNode.id;
    var tabList = document.getElementById(tabObj).getElementsByTagName("li");
    for (i = 0; i < tabList.length; i++) {
        if (i == Num) {
            thisObj.className = "current";
            document.getElementById(tabObj + "_Content" + i).style.display = "block";
        } else {
            tabList[i].className = "";
            document.getElementById(tabObj + "_Content" + i).style.display = "none";
        }
    }
}
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
        'opacity': '1', 'margin-top': '120px'
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
function showTopTip(msg) {
    var h = '<div id="topTip" class="topTip"></div>';
    if (!$("#topTip")[0])
        $('body').append(h);
    var o = $('#topTip').html(msg);
    o.show(0).stop().animate({ 'opacity': '1' }, 200, function () {
        o.delay(500).animate({ 'opacity': '0' }, 2000, function () { o.hide(); })
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

//ajax部分,发出裁剪请求，获取裁剪后的图片路径*******注：暂时没用到该方法*******
function goCrop() {
    if (!parseInt($('#w').val())) {
        showTopTip('请选择裁剪区域');
        return;
    }
    var postdata = { x: $('#x').val(), y: $('#y').val(), w: $('#w').val(), h: $('#h').val(), src: $('#src').val() };
    $.ajax({
        url: "jcrop.php",
        type: "POST",
        data: postdata,
        //dataType: "json",
        error: function () {
            alert('出错了，请重试');
        },
        success: function (data, status) {
            console.log(status + "::::" + data);
            $("#imgCut").attr('src', data.trim())
        }
    });
};
//==============================华丽分割线05====裁剪  end====================================

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
        var elBox = $('<div class="el-box el-resize-fix ani" style="width: ' + tarW + 'px; height: ' + tarH + 'px; position: absolute; left: 60px; top: 20px; z-index:' + (getMaxZIndex() + 1) + ';"></div>')
        var d = $('<div class="el-box-mid"></div>');
        var cts = $(' <div id="' + id + '" class="el-box-contents" ctype="1"><div>');
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
    bindConfirmImg(2);
    $("#manageImg").hide();
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
        showTopTip("没有选中的图片哦~~");
        return;
    }
    var src = img.attr("src");
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
//确认添加新建分组
function confirmXjfz() {
    var name = $("#changeimg div.newtc input.input3").val().trim();
    if (name == "") {
        alert("分组名不能为空");
    } else {
        alert(name);
        hideXjfz();
    }
}
//管理图片
function manageImg() {
    var text = $("#manageImg").text().trim();
    var lis = $("#myTab4_Content1 ul.imglist>li");
    if (text == "管理图片") {
        $("#manageImg").text("退出管理");
        $("#myTab4_Content1 div.qrxz").hide();
        $("#myTab4_Content1 div.delpic").show().unbind('click').bind('click', deleteMyImg);
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
    $("#myTab4_Content1 div.delpic").hide();
}
//管理图片--选中
function manageSelect(param) {
    var li = param.data.li;
    var h2 = li.children("h2");
    h2.toggleClass("cur");
}
//删除自己的图片
function deleteMyImg() {
    //1.从数据库里删除
    //2.获取删除成功状态后从页面上删除

    var lis = $("#myTab4_Content1 ul.imglist>li");
    lis.each(function () {
        var li = $(this);
        if (li.children('h2.cur')[0]) li.remove();
    });
}
//==============================华丽分割线07====添加、替换图片  end================================


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
        $(" #changemusic table tr td img.playing").attr('src', '../Edit_img/music_p.png');
    }
}
//点击音乐列表行 20151015 修改
function bindMscTrCick() {
    var imgs = $(" #changemusic table tr td img");
    $(" #changemusic table tr ").unbind('click').bind('click', function () {
        var tr = $(this);
        var radio = tr.find('input[type=radio]');
        radio[0].checked = true;
        var img = tr.find("td img");
        if (img.hasClass("playing")) {
            mscPause();
            img.attr('src', '../Edit_img/music_p.png');
        }
        else {
            imgs.filter(".playing").attr('src', '../Edit_img/music_p.png').removeClass("playing");
            img.attr('src', '../Edit_img/music_zt.png');
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
        //e.stopPropagation();
        var img = $(this);
        if (img.hasClass("playing")) {
            mscPause();
            img.attr('src', '../Edit_img/music_p.png');
        }
        else {
            imgs.filter(".playing").attr('src', '../Edit_img/music_p.png').removeClass("playing");
            img.attr('src', '../Edit_img/music_zt.png');
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
        var name = c.parent('td').next('td').text().trim();
        $("#edit_music .input4").val(name);
        $("#stPlayer").attr('data-name', name);
        $("#mscName").text(name);
        hideMscDialog();
        $("#bgMusic").attr("src", src)[0].pause();  // 设置背景音乐
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
//==============================华丽分割线09====背景音乐  end====================================

//==============================华丽分割线11====动画选项卡  begin==================================

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

//ajax部分,发出裁剪请求，获取裁剪后的图片路径
function goCropImg(type) {
    if (!parseInt($('#w').val())) {
        showTopTip('请选择裁剪区域');
        return;
    }
    var postdata = { x: $('#x').val(), y: $('#y').val(), w: $('#w').val(), h: $('#h').val(), src: $('#src').val() };
    $.ajax({
        url: "jcrop.php",
        type: "POST",
        data: postdata,
        //dataType: "json",
        error: function () {
            alert('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                var src = data.trim();
                if (type == "cutImg") {
                    replaceImg(src);
                    var nowW = NowBox.width(), nowH = NowBox.height();
                    var caiW = parseFloat($('#w').val()), caiH = parseFloat($('#h').val());
                    caiW / caiH > 1 ? NowBox.height(caiH / caiW * nowW) : NowBox.width(caiW / caiH * nowH);
                    setLvJingObj();
                } else if (type == "cutBgImg") {
                    changeSceneBg(src)
                } else if (type == "cutFMImg") {
                    $("#fengMian").attr('src', src);
                }
                //updateSlide();
                hideImgCutDialog();
            }
        }
    });
};
//==============================华丽分割线12====裁剪图片  end====================================

//==============================华丽分割线15====设置  begin============================================
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

//提交设置
function submitSetting() {
    //获取现在设置的各个参数，post到数据库保存
    var fengMian = $("#fengMian").attr("src");//封面
    var title = $("#sceneTitle").val();;
    var description = $("#sceneDesc").val();
    var category = $("#fenlei3").val();

    var mscSrc = $("#stPlayer").attr("src");
    var mscName = $("#mscName").text();
    var slideType = $("#fenlei5").val();
    var whoSee = $("#fenlei6").val();

    preview();//先放在这里，作为演示用，加上程序后删除

    //var data = { "fengMian": fengMian, "title": title, "description": description, "category": category, "mscSrc": mscSrc, "mscName": mscName, "slideType": slideType, "whoSee": whoSee }
    //var postdata = { "type": "submitSetting", "data": data };
    //$.ajax({
    //    url: "main.php",
    //    type: "post",
    //    data: postdata,
    //    //dataType: "json",
    //    error: function () {
    //        alert('出错了，请重试');
    //    },
    //    success: function (data, status) {
    //        if (status == 'success') {
    //            //--------------------------成功后的操作，这里先写一个提示吧-------------

    //            preview();
    //        }
    //    }
    //});
}
//预览
function preview() {
    window.open("./preview.html");
}
//==============================华丽分割线15====设置  end============================================

//==============================华丽分割线19====解析json  begin==================================

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
        box[0].style.transform = "rotateZ(" + css.transform + "deg)";
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
    return contentBox;
}
//==============================华丽分割线19====解析json  end====================================

//==============================华丽分割线20====load整个场景的全部页面  begin====================
//获取整个场景所有页面的json
function getAllSlidesJson() {
    //以下代码放到ajax里面即可，json为返回的数据
    json = { "sceneId": "156413", "fengmian": "images/ad5.jpg", "title": "我是标题", "desc": "这里是描述", "category": "企业", "bgMsc": "./assets/mp3/3.mp3", "bgMscName": "泡沫.mp3", "slideType": "1", "whoSee": "所有人", "slides": [{ "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/a11.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "center", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字<br>我是新生成的文字<br>我是新生成的文字<br>我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/m4.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/m3.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/ad10.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "images/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "50", "height": "294", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "images/line2.png", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "1", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }] };

    var slides = json.slides;
    //var wrapper = $("#swiper-container div.swiper-wrapper").html("");
    var slideLast = $("#slide_last");
    var len = slides.length;
    for (var i = 0; i < len; i++) {
        var slideJson = slides[i].slide;
        slideLast.before(getSlideHtmlByJson(slideJson));
    }

    setDirection(json.slideType);           // 设置翻页方式
    $("#bgMusic").attr("src", json.bgMsc);  // 设置背景音乐
    initPage();
    //初始化“设置面板”
    setSetting(json);
}
//页面初始化时的一些参数
function setSetting(json) {
    window.sceneId = json.sceneId;
    var fengmian = json.fengmian;
    var title = json.title;
    var desc = json.desc;
    var category = json.category;
    var bgMsc = json.bgMsc;
    var bgMscName = json.bgMscName;
    var slideType = json.slideType;
    var whoSee = json.whoSee;

    $("#fengMian").attr("src", fengmian);//封面
    title ? $("#sceneTitle").val(title) : "";
    desc ? $("#sceneDesc").val(desc) : "";
    setDefaultOption("fenlei3", category);//分类
    $("#stPlayer").attr("src", bgMsc).attr('data-name', bgMscName);
    $("#mscName").text(bgMscName);//音乐名
    setDefaultOption("fenlei5", slideType);//翻页
    setDefaultOption("fenlei6", whoSee);//谁可以看 
}
//改变翻页效果
function changeSlideType(value) {
    setDirection(value);
    mySwiper.destroy(true, true);
    //初始化swiper和动画
    initSwiper({ 'id': 'swiper-container' });
}
//==============================华丽分割线20====load整个场景的全部页面  end========================
