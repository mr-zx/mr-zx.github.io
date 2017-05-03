/**
 * pc端，顶部下落渐现弹窗，以及鼠标悬停事件
 * author：zx 2015.7.23
 */
function showTopDialog(id, marginTop) {
    $("#mask").fadeIn(500);
    $("#" + id).show().animate({ 'top': marginTop, 'opacity': 1 }, 1000, 'swing');    
    showRightDelay();
    $("#" + id).click(function (e) { e.stopPropagation(); });
    $("#toRight").click(function (e) { e.stopPropagation(); });
}
function hideTopDialog(id) {
    var o = $("#" + id);
    var h = o[0].offsetHeight;
    o.animate({ 'top': -h, 'opacity': 0 }, 1000, 'linear', function () { o.hide(); });
}
function hideMask() {
    $("#mask").fadeOut(500);
    $('.topDialog').each(function () { var id = $(this).attr('id'); hideTopDialog(id); hideRight('toRight') });
}
function showRight(id, marginLeft) {
    $("#" + id).show().stop().animate({ 'margin-left': marginLeft, 'opacity': 1 }, 500);
}
function hideRight(id) {
    var o = $("#" + id);
    o.stop().animate({ 'margin-left': '0px', 'opacity': 0 }, 500, 'linear', function () { o.hide(); });
}
function showRightDelay() {
    $("#toRight").show().stop().delay(1000).animate({ 'margin-left': '180px', 'opacity': 1 }, 500);
}