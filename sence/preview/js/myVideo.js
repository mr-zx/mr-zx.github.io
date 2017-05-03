
//绑定视频按钮点击事件
function initVideoShow() {
    $("a.video_btn").unbind().click(function () {
        var videoUrl = $(this).attr("videourl");
        showVideo(videoUrl);
        return false;
    });
}
//显示视频
function showVideo(videoUrl) {
    var $mask = $('<div class="video_mask"></div>');
    var $close = $('<a class="close_close"></a>');
    $mask.append($close);
    $iframe = $(videoUrl);
    $iframe.attr("style", "position:absolute;min-height:45%;max-height:100%;top:20%;");
    $iframe.removeAttr("height");
    $iframe.attr('width', '100%');
    $mask.append($iframe);
    $mask.appendTo("body");
    $close.unbind().click(function () {
        $mask.remove(); return false;
    });
}