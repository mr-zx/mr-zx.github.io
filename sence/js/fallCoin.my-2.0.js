/**
 * 金币下落
 * zx 2015.7.11 modify
 */
var goldFallInterval;
var fallTimeMs = 2500;
var fallCoinCounts = 15;
//初始化
function initGoldFall() {
    $('#coinCTN').height($(window).height());
    for (i = 0; i < fallCoinCounts; i++) {
        $('<div class="coin"></div>').prependTo('#coinCTN');
    }
    var tLeft = ($('#coinCTN').width() - $("#coinCTN .coinText").width()) / 2;
    $("#coinCTN .coinText").css({ 'top': 0, 'left': tLeft }).delay(500).animate({
        opacity: 1,
        "top": $('#coinCTN').height() * 0.5,
    }, 500).delay(1000).animate({
        opacity: 0,
        "top": $('#coinCTN').height() * 1,
    }, 500);
}
//开始
function startGoldFall() {
    range();
    clearInterval(goldFallInterval);
    goldFallInterval = setInterval(rotateCoin, 200);
    dropGoldFall();
    setTimeout(function () {
        clearInterval(goldFallInterval);
        $("#coinCTN").remove();
    }, fallTimeMs);
}
//排列
function range() {
    var pyArr = [0, 30, 60, 90, 120, 150, 180];
    $('div.coin', '#coinCTN').each(function (i) {
        var dw = $('#coinCTN').width();
        var dh = $('#coinCTN').height();
        $(this).css({ "left": (i * (dw / fallCoinCounts)) + "px", "top": (-parseInt(Math.random() * (dh / 2))) + "px", 'background-position-y': pyArr[Math.floor(Math.random() * 7)] + 'px' });
    });
}
//降落
function dropGoldFall() {
    $('div.coin', '#coinCTN').each(function (i) {
        var wh = $('#coinCTN').height();
        var ot = $(this).position().top;
        $(this).animate({ "top": (wh - ot) + "px" }, Math.random() * 1000 + (fallTimeMs - 1000));
    });
}
//旋转
function rotateCoin() {
    var $objs = $('div.coin', '#coinCTN');
    $objs.each(function (i) {
        var py = parseInt($(this).css('background-position-y').replace(/[^0-9]/ig, ""));
        py = parseInt(py + 30) > 180 ? 0 : parseInt(py + 30);
        $(this).css({ 'background-position-y': py + 'px' });
    });
}
