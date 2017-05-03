
//ajax部分,发出裁剪请求，获取裁剪后的图片路径*******注：暂时没用到该方法*******
function goCrop() {
    if (!parseInt($('#w').val())) {
        showTopTip('请选择裁剪区域');
        return;
    }
    var postdata = { x: $('#x').val(), y: $('#y').val(), w: $('#w').val(), h: $('#h').val(), src: $('#src').val() };
    $.ajax({
        url: cropImgUrl,
        type: "POST",
        data: postdata,
        //dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            console.log(status + "::::" + data);
            $("#imgCut").attr('src', data.trim())
        }
    });
};

//确认添加新建分组
function confirmXjfz() {
    var name = $("#changeimg div.newtc input.input3").val().trim();
    if (name == "") {
        showTopTip("分组名不能为空");
    } else {
        var classtype = $("#fenlei").attr("classtype");
        var postdata = { 'type': 'addGroup', 'pictype': classtype, 'groupname': name };
        $.ajax({
            url: sourceMyUrl,
            type: "POST",
            data: postdata,
            dataType: "json",
            error: function () {
                alert('出错了，请重试');
            },
            success: function (data, status) {
                showTopTip(data.msg);
                if (data.code > 0) {
                    var data = data.code;
                    $("#changeimg div.newtc input.input3").val('');
                    $("#fenlei option").removeAttr('selected');
                    $('<option value="' + data + '" selected="selected">' + name + '</option>').insertAfter($("#fenlei option").eq(0));
                    selectPretty('fenlei', function (value) { autoSourceMy("#fenlei", 'sourceMyImgList'); });
                    setDefaultOption('fenlei', data)
                    var html = '<div id="sourceMyImgList' + data + '" class="sourceMyImgList" style="display: block;">' +
	        				'<ul class="imglist">' +
	        				'<div style="text-align: center"><span style="line-height:32px;color: red; display: block; text-align: center;">暂无信息</span></div>' +
	        				'</ul></div>';
                    $("#sourceMyImgList").append(html);
                    showSourceMyImgDiv(data);
                    sourceMyImgButton(data);
                }
            }
        });
        hideXjfz();
    }
}

//删除自己的图片
function deleteMyImg() {
    //1.从数据库里删除
    var groupid = $("#fenlei").val();
    var dataidObj = $("#myTab4_Content1 #sourceMyImgList" + groupid + " ul.imglist>li h2.cur");
    var idStr = '';
    dataidObj.each(function () {
        idStr += $(this).parent().attr("dataid") + ',';
    })
    if (idStr) {
        var classtype = $("#fenlei").attr('classtype');
        var postdata = { 'type': 'delMy', 'pictype': classtype, 'groupid': groupid, 'idstr': idStr };
        $.ajax({
            url: sourceMyUrl,
            type: "POST",
            data: postdata,
            dataType: "json",
            error: function () {
                alert('出错了，请重试');
            },
            success: function (data, status) {
                showTopTip(data.msg);
                if (data.code == 1) {
                    //2.重新加载
                    var ajaxUrl = $("#fenlei").attr("dataurl");
                    setTimeout(function () {
                        if (groupid != 0) {
                            $("#sourceMyImgList0 ul.imglist").html('');
                        }
                        ajaxSourceMy(ajaxUrl, classtype, groupid, 'sourceMyImgList', $("#fenlei"));
                    }, 1000);
                }
            }
        });
    } else {
        showTopTip("没有选中的图片哦~");
    }
}

//确认添加新建分组
function confirmBgXjfz() {
    var name = $("#changebg div.newtc input.input3").val().trim();
    if (name == "") {
        showTopTip("分组名不能为空");
    } else {
        var classtype = $("#fenlei2").attr("classtype");
        var postdata = { 'type': 'addGroup', 'pictype': classtype, 'groupname': name };
        $.ajax({
            url: sourceMyUrl,
            type: "POST",
            data: postdata,
            dataType: "json",
            error: function () {
                alert('出错了，请重试');
            },
            success: function (data, status) {
                showTopTip(data.msg);
                if (data.code > 0) {
                    var data = data.code;
                    $("#changebg div.newtc input.input3").val('');
                    $("#fenlei2 option").removeAttr('selected');
                    $('<option value="' + data + '" selected="selected">' + name + '</option>').insertAfter($("#fenlei2 option").eq(0));
                    selectPretty('fenlei2', function (value) { autoSourceMy("#fenlei2", 'sourceMyBgList'); });
                    setDefaultOption('fenlei2', data)
                    var html = '<div id="sourceMyBgList' + data + '" class="sourceMyBgList" style="display: block;">' +
	        				'<ul class="imglist">' +
	        				'<div style="text-align: center"><span style="line-height:32px;color: red; display: block; text-align: center;">暂无信息</span></div>' +
	        				'</ul></div>';
                    $("#sourceMyBgList").append(html);
                    showSourceMyBgDiv(data);
                    sourceMyBgButton(data);
                }
            }
        });
        hideBgXjfz();
    }
}

//删除自己的图片
function deleteMyBg() {
    //1.从数据库里删除
    var groupid = $("#fenlei2").val();
    var dataidObj = $("#myTab5_Content1 #sourceMyBgList" + groupid + " ul.imglist>li h2.cur");
    var idStr = '';
    dataidObj.each(function () {
        idStr += $(this).parent().attr("dataid") + ',';
    })
    if (idStr) {
        var classtype = $("#fenlei2").attr('classtype');
        var postdata = { 'type': 'delMy', 'pictype': classtype, 'groupid': groupid, 'idstr': idStr };
        $.ajax({
            url: sourceMyUrl,
            type: "POST",
            data: postdata,
            dataType: "json",
            error: function () {
                alert('出错了，请重试');
            },
            success: function (data, status) {
                showTopTip(data.msg);
                if (data.code == 1) {
                    showTopTip("删除成功");
                    //2.重新加载
                    var ajaxUrl = $("#fenlei2").attr("dataurl");
                    setTimeout(function () {
                        if (groupid != 0) {
                            $("#sourceMyBgList0 ul.imglist").html('');
                        }
                        ajaxSourceMy(ajaxUrl, classtype, groupid, 'sourceMyBgList', $("#fenlei2"));
                    }, 1000);
                }
            }
        });
    } else {
        showTopTip("没有选中的图片哦~");
    }
}

//删除自己的音乐  20151216增加
function deleteMyMsc() {
    var selValStr = "";//被选中音乐的id数组
    $("#changemusic ul.music_list table tr input[name='mscSel']").each(function () {
        if (this.checked) {
            selValStr += $(this).siblings("input[name='r']").val() + ",";
        }
    });
    //1.从数据库里删除
    if (selValStr) {
        var postdata = { 'type': 'delMy', 'idstr': selValStr };
        $.ajax({
            url: musicMyUrl,
            type: "POST",
            data: postdata,
            dataType: "json",
            error: function () {
                alert('出错了，请重试');
            },
            success: function (data, status) {
                showTopTip(data.msg);
                if (data.code == 1) {
                    isInitMusicMy = false;
                    initMusicMy();
                    $("#manageMsc").html("管理音乐");
                    manageMsc();
                }
            }
        });
    }
}

//确认添加添加音乐
function confirmMusicXjfz() {
    var thisObj = $("#musicAddBtn");
    var ishasClass = thisObj.hasClass('disabledBtn');
    if (ishasClass) return false;
    thisObj.find('a').html("请稍等. . . ");
    thisObj.removeClass("qrxzBtn").addClass("disabledBtn");
    var name = $("#changemusic div.newtc").find("#musicname").val().trim();
    var musicurl = $("#changemusic div.newtc").find("#musicurl").val().trim();
    if (name == "") {
        showTopTip("音乐名称不能为空");
    } else if (musicurl == "") {
        showTopTip("音乐地址不能为空");
    } else if (!IsURL(musicurl)) {
        showTopTip("请输入正确的音乐地址");
    } else {
        var postdata = { 'type': 'addMy', 'title': name, 'musicurl': musicurl };
        $.ajax({
            url: musicMyUrl,
            type: "POST",
            data: postdata,
            async: false,
            dataType: "json",
            error: function () {
                alert('出错了，请重试');
            },
            success: function (data, status) {
                showTopTip(data.msg);
                if (data.code > 0) {
                    hideMusicXjfz();
                    $("#changemusic div.newtc").find("#musicname").val('');
                    $("#changemusic div.newtc").find("#musicurl").val('');
                    isInitMusicMy = false;
                    var thisCur = $("#myTab7 li.current").html().trim();
                    if (thisCur == '我的音乐') {
                        setTimeout(function () { initMusicMy(); }, 1000);
                    }
                }
            }
        });
    }
    thisObj.find('a').html("确定增加");
    thisObj.removeClass("disabledBtn").addClass("qrxzBtn");
}

//ajax部分,发出裁剪请求，获取裁剪后的图片路径
function goCropImg(type) {
    if (!parseInt($('#w').val())) {
        showTopTip('请选择裁剪区域');
        return;
    }
    var postdata = { x: $('#x').val(), y: $('#y').val(), w: $('#w').val(), h: $('#h').val(), src: $('#src').val() };
    $.ajax({
        url: cropImgUrl,
        type: "POST",
        data: postdata,
        //dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                var src = data.trim();
                if (type == "cutImg") {
                    replaceImg(src);
                    //----- 20151105 改为裁剪后的尺寸 begin
                    var nowW = NowBox.width(), nowH = NowBox.height();
                    var caiW = parseFloat($('#w').val()), caiH = parseFloat($('#h').val());
                    caiW / caiH > 1 ? NowBox.height(caiH / caiW * nowW) : NowBox.width(caiW / caiH * nowH);
                    //----- 20151105 改为裁剪后的尺寸 end
                    setLvJingObj();
                } else if (type == "cutBgImg") {
                    changeSceneBg(src)
                } else if (type == "cutFMImg") {//20151015
                    $("#fengMian").attr('src', src);
                }
                updateSlide();
                hideImgCutDialog();
            }
        }
    });
};

//执行应用模板  20151015 修改
function doInsertPageTpl(o) {
    confirmUseTpl(o);
    var li = $(o);
    var tplId = li.attr('tpl_id');
    //根据模板id获取该模板的json数据，并绑定到页面-----------------------
    var postdata = { "type": "getTpl", "tplId": tplId };
    $.ajax({
        url: getSinglePageJsonUrl,
        type: "post",
        data: postdata,
        //dataType: "json",
        error: function () {
            alert('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //--------------------------成功后的操作，这里先写一个提示吧-------------
                //console.log(data)
                //这里写一个假的
                /*
            	var json = {
                        "sceneId": "",
                        "pageId": "",
                        "bgColor": "rgba(0, 0, 0, 0)",
                        "bgUrl": "Edit_img/a15.jpg",
                        "elements": [
                            {
                                "id": "1001",
                                "ctype": "1",
                                "properties": {
                                    "ani": {
                                        "type": "41",
                                        "duration": "2",
                                        "delay": "0",
                                        "count": "2",
                                        "direction": ""
                                    }
                                },
                                "css": {
                                    "width": "200",
                                    "height": "250",
                                    "left": "60",
                                    "top": "20",
                                    "zIndex": "1",
                                    "transform": "0"
                                },
                                "mid": {
                                    "css": {
                                        "borderWidth": "0",
                                        "borderStyle": "none",
                                        "borderColor": "rgba(0, 0, 0, 1)",
                                        "opacity": "1",
                                        "borderRadius": "0",
                                        "boxShadow": "none",
                                        "backgroundColor": "rgba(0, 0, 0, 0)",
                                        "paddingTop": "0"
                                    }
                                },
                                "content": {
                                    "src": "Edit_img/a10.jpg",
                                    "contents": ""
                                }
                            },
                            {
                                "id": "1002",
                                "ctype": "2",
                                "properties": {
                                    "ani": {
                                        "type": "37",
                                        "duration": "2",
                                        "delay": "0",
                                        "count": "infinite",
                                        "direction": ""
                                    }
                                },
                                "css": {
                                    "width": "230",
                                    "height": "120",
                                    "left": "50",
                                    "top": "300",
                                    "zIndex": "2",
                                    "transform": "0"
                                },
                                "mid": {
                                    "css": {
                                        "borderWidth": "0",
                                        "borderStyle": "none",
                                        "borderColor": "rgba(0, 0, 0, 1)",
                                        "opacity": "1",
                                        "borderRadius": "0",
                                        "boxShadow": "none",
                                        "backgroundColor": "rgba(0, 0, 0, 0)",
                                        "paddingTop": "0"
                                    }
                                },
                                "content": {
                                    "css": {
                                        "color": "rgba(0, 0, 0, 1)",
                                        "lineHeight": "2",
                                        "fontFamily": "微软雅黑",
                                        "textAlign": "start",
                                        "fontSize": "14px"
                                    },
                                    "src": "",
                                    "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字"
                                }
                            }
                        ]
                    };
                    */
                //json = eval("("+data+")");
                json = data;
                var o = getSlideHtmlByJson(json);
                o.attr('id', PhoneId);
                Phone.replaceWith(o);
                initPhone();
                updateSlide();
                //showTopTip("应用版式成功~ （测试用，上线前删除）");
            }
        }
    });
}

//提交设置
function submitSetting(bit) {
    //获取现在设置的各个参数，post到数据库保存
    var fengMian = $("#fengMian").attr("src");//封面
    var title = $("#sceneTitle").val();;
    var description = $("#sceneDesc").val();
    var category = $("#fenlei3").val();      //20151016 改为读取value
    var mscSrc = $("#stPlayer").attr("src");
    var mscName = $("#mscName").text();
    var slideType = $("#fenlei5").val();     //20151016 改为读取value
    var whoSee = $("#fenlei6").val();        //20151016 改为读取value


    var data = { "fengMian": fengMian, "title": title, "description": description, "category": category, "mscSrc": mscSrc, "mscName": mscName, "slideType": slideType, "whoSee": whoSee }
    var postdata = { "type": "submitSetting", "sceneId": sceneId, "data": data };
    $.ajax({
        url: ajaxPageUrl,
        type: "post",
        data: postdata,
        dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //--------------------------成功后的操作，这里先写一个提示吧-------------
                //console.log(data)
                //这里写一个假的
                if (!bit) {
                    showTopTip(data.msg);
                }
                hideEditConfig();
            }
        }
    });
}

//保存当前页json数据到数据库
function savePage(isShowTip) {
    if (isModify()) {
        return false;
    }
    var slide = $("#" + PhoneId)
    var json = getSlideJson(slide);
    var postdata = { "type": "savePage", "sceneId": sceneId, "json": json };
    //传给数据库
    $.ajax({
        url: ajaxPageUrl,
        type: "post",
        data: postdata,
        dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //--------------------------保存成功后的操作，这里先写一个提示吧-------------
                if (isShowTip) {
                    if (data.code == 1) {
                        saveTip();
                    } else {
                        showTopTip(data.msg);
                    }
                }
            }
        }
    });
}

//获取整个场景所有页面的json
function getAllSlidesJson() {
    var postdata = { "type": "getAllPage", "sceneId": sceneId };
    $.ajax({
        url: ajaxPageUrl,
        type: "post",
        data: postdata,
        dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //--------------------------成功后的操作--------------------
                var json = data;
                //1. 把数据转化成html绑定到设置面板、音乐面板
                //2. 把数据转化成html绑定到左侧页码导航

                //假数据，仅用来说明json格式
                //json = {
                //    "sceneId": "156413",
                //    "fengmian": "images/fm123.jpg",
                //    "title": "我是标题",
                //    "desc": "这里是描述",
                //    "category": "企业",
                //    "bgMsc": "mp3/paomo.mp3",
                //    "bgMscName": "泡沫.mp3",
                //    "slideType": "上下翻页",
                //    "whoSee": "所有人",
                //    "slides": [
                //        {
                //            "slide": {}
                //        },
                //        {
                //            "slide": {}
                //        },
                //        {
                //            "slide": {}
                //        },
                //        {
                //            "slide": {}
                //        }
                //    ]
                //}
                //                json = { "sceneId": "156413", "fengmian": "Edit_img/ad5.jpg", "title": "我是标题", "desc": "这里是描述", "category": "企业", "bgMsc": "Edit_mp3/3.mp3", "bgMscName": "泡沫.mp3", "slideType": "上下翻页", "whoSee": "所有人", "slides": [{ "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "Edit_img/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "2", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "Edit_img/a11.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "infinite", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "Edit_img/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "2", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "Edit_img/m4.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "infinite", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "Edit_img/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "2", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "Edit_img/m3.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "infinite", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }, { "slide": { "sceneId": "", "pageId": "", "bgColor": "rgba(255, 255, 255, 1)", "bgUrl": "Edit_img/a15.jpg", "elements": [{ "id": "1001", "ctype": "1", "properties": { "ani": { "type": "41", "duration": "2", "delay": "0", "count": "2", "direction": "" } }, "css": { "width": "200", "height": "250", "left": "60", "top": "20", "zIndex": "1", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "src": "Edit_img/ad10.jpg", "contents": "" } }, { "id": "1002", "ctype": "2", "properties": { "ani": { "type": "37", "duration": "2", "delay": "0", "count": "infinite", "direction": "" } }, "css": { "width": "230", "height": "120", "left": "50", "top": "300", "zIndex": "2", "transform": "0" }, "mid": { "css": { "borderWidth": "0", "borderStyle": "none", "borderColor": "rgba(0, 0, 0, 1)", "opacity": "1", "borderRadius": "0", "boxShadow": "none", "backgroundColor": "rgba(0, 0, 0, 0)", "paddingTop": "0" } }, "content": { "css": { "color": "rgba(0, 0, 0, 1)", "lineHeight": "2", "fontFamily": "微软雅黑", "textAlign": "start", "fontSize": "14px" }, "src": "", "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字" } }] } }] };

                setSetting(json);
                createLeftByJson(json.slides);
                initEdit_left()
                bindKeyup();
                clickBg();
                //initEdit_left();
            }//if
        }
    });
}

//保存新的顺序到数据库
function saveNewSort(oldNum, NewNum) {
    var postdata = { "type": "saveNewSort", "sceneId": sceneId, "oldNum": oldNum, "NewNum": NewNum };
    $.ajax({
        url: ajaxPageUrl, type: "post",
        data: postdata,
        dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //            	showTopTip(data.msg);
            }
        }
    });
}

//添加空白页
function addOnePage() {
    var length = $(".Edit_left ul li").length;
    if (length >= maxPageNum) {
        showTopTip("每个场景最多创建" + maxPageNum + "页哦！");
        return;
    }
    var html = ''
    + '<li>'
        + '<div class="num">' + (length + 1) + '</div>'
        + '<div class="pageList_content">'
            + '<div class="swiper-slide">'
                + '<div class="page-background" bg-url="" style="background-color:rgba(255,255,255,1)"></div>'
            + '</div>'
            + '<a class="copy">复制</a><a class="del">删除</a>'
        + '</div>'
    + '</li>';
    var li = $(html);
    $(".Edit_left ul").append(li);
    pageListEvent(li);
    initSort();
    setActivePage(li);
    $('.Edit_left').stop().animate({ scrollTop: (length + 1) * 200 }, 500);
    //------------------保存--需要存到数据库----------------------------
    var postdata = { "type": "addOnePage", "sceneId": sceneId };
    $.ajax({
        url: ajaxPageUrl, type: "post",
        data: postdata,
        dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //--------------------------成功后的操作-------------    
                //            	showTopTip(data.msg);
            }
        }
    });
}

//确认删除一页
function doDeleteOnePage() {
    var li = $(".Edit_left ul li.toDel");
    var prev = li.prev('li');
    var next = li.next('li');
    if (!prev[0] && !next[0]) {
        showTopTip("已经是最后一页了，不可删除！");
        return;
    }
    var pageNum = li.children("div.num").text();
    li.remove();
    orderPageNum();
    if (next[0]) {
        setActivePage(next);
    } else if (prev) {
        setActivePage(prev);
    }
    //-------------------需要存到数据库----------------------------
    var postdata = { "type": "deleteOnePage", "sceneId": sceneId, "pageNum": pageNum };
    $.ajax({
        url: ajaxPageUrl, type: "post",
        data: postdata,
        dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //--------------------------成功后的操作-------------    
                //showTopTip(data.msg);
            }
        }
    });
}

//复制一页
function copyOnePage() {
    savePage();
    var length = $(".Edit_left ul li").length;
    if (length >= maxPageNum) {
        showTopTip("每个场景最多创建" + maxPageNum + "页哦！");
        return;
    }
    var li = $(".Edit_left ul li.li_hover");
    $("div.Edit_left div.pageList_content.active").removeClass("active");
    var newLi = li.clone();
    newLi.removeClass("li_hover");
    li.after(newLi);
    orderPageNum();
    pageListEvent(newLi);
    initSort();
    setActivePage(newLi);
    //------------------保存--需要存到数据库----------------------------
    var pageNum = li.children("div.num").text();
    var postdata = { "type": "copyOnePage", "sceneId": sceneId, "pageNum": pageNum };
    $.ajax({
        url: ajaxPageUrl, type: "post",
        data: postdata,
        dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //--------------------------成功后的操作-------------    
                //showTopTip(data.msg);
            }
        }
    });
}

//发布
function publish() {
    showTopTip("正在发布", 60000);
    savePage();
    submitSetting(1);
    $("body").removeAttr("onbeforeunload");//取消监听当前页关闭时的提醒
    setTimeout(function () { window.location.href = finallyUrl; }, 3000);
    return false;
    var postdata = { "type": "publish", "sceneId": sceneId };
    //传给数据库
    $.ajax({
        url: ajaxPageUrl,
        type: "post",
        data: postdata,
        dataType: "json",
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
                //--------------------------保存成功后的操作，这里先写一个提示吧-------------
                showTopTip(data.msg);
                if (data.code == 1) {
                    setTimeout(function () { window.location.href = sceneListUrl; }, 2000);
                }
            }
        }
    });
}

//滤镜工具对象定义,勿改
function LvJing(imgobj) {
    var originalCanvas = $('<canvas>');
    this.imgSrc = "";
    this.init = function (imgobj) {
        if (!imgobj) return;
        this.imgSrc = $(imgobj).attr('src');
        var imgWidth = imgobj.width;
        var imgHeight = imgobj.height;
        var newHeight = imgHeight;
        var newWidth = imgWidth;

        var originalContext = originalCanvas[0].getContext('2d');
        originalCanvas.attr({ width: newWidth, height: newHeight });
        //画到画布上
        originalContext.drawImage(imgobj, 0, 0, newWidth, newHeight);
    }
    this.init(imgobj);
    this.useEffect = function (effect, callback) {
        //callback={"succese": function (src){ } };
        var clone = originalCanvas.clone();
        clone[0].getContext('2d').drawImage(originalCanvas[0], 0, 0);
        if (effect == "normal") {
            //使用原图  
            callback.succese(this.imgSrc);
            return;
        }
        var originalUrl = this.imgSrc;
        Caman(clone[0], function () {
            // If such an effect exists, use it:            
            if (effect in this) {
                this[effect]();
                this.render(function () {
                    //使用效果成功后                    
                    var url = clone[0].toDataURL("image/png;base64;");
                    $.post(filterImgUrl, { "img": url, "originalUrl": originalUrl }, function (data) {
                        var src = data;
                        var rand = parseInt(Math.random() * 100);
                        callback.succese(src + '?' + rand);
                    });
                });
            }
        });
    }
}

