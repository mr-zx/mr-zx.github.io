/**
 * 加载页面背景圆形旋转
 * zx 2015.7.10 14:09 modify
 */
var isLoaded = false;
function loadingAni() {
    var loader = document.getElementById('la-anim-6-loader')
        , border = document.getElementById('la-anim-6-border')
        , α = 0
        , π = Math.PI
        , t = 10
        , tdraw
        , inProgress = false;
    $("#loadingCtn").css({ 'position': 'fixed', 'width': '100%', 'left': '0px', 'top': '0px' }).bind('touchmove', function (e) { e.preventDefault(); e.stopPropagation(); });
    $("#la-anim-6-loader").attr('transform', 'translate(250, 250) scale(0.30)');
    $("#la-anim-6-border").attr('transform', 'translate(250, 250) scale(0.35)');
    function PieDraw() {
        if (document.getElementById("bgMusic"))
            document.getElementById("bgMusic").pause();
        α++;
        α %= 360;
        var r = (α * π / 180)
        , x = Math.sin(r) * 250
        , y = Math.cos(r) * -250
        , mid = (α > 180) ? 1 : 0
        , anim = 'M 0 0 v -250 A 250 250 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';

        loader.setAttribute('d', anim);
        border.setAttribute('d', anim);

        //if (α % 10)
        //    t = Math.random() * 10 + 15
        if (isLoaded) {
            t = 1;
        } else {
            //if (α == 300)
            //    t = 600;
        }
        if (α != 359)
            tdraw = setTimeout(PieDraw, t);
        else
            PieEnd();
    }

    function PieEnd() {
        clearTimeout(tdraw);
        var anim = 'M 0 0 v -250 A 250 250 1 0 1 0 -250 z';
        loader.setAttribute('d', anim);
        border.setAttribute('d', anim);
        var animEl = document.querySelector('.la-anim-6');
        //classie.remove(animEl, 'la-animate');
        inProgress = false;
        $("#loadingCtn").remove();
        //if (document.getElementById("bgMusic"))
        //    document.getElementById("bgMusic").play();
        try {
            //initSwiper();
            initPage();//动画播放完成，初始化页面
        } catch (e) { }
    }

    function PieBegin() {
        var animEl = document.querySelector('.la-anim-6');
        if (inProgress) return false;
        inProgress = true;
        //classie.add(animEl, 'la-animate');
        PieDraw();
    }
    PieBegin();
}
$(function () {
    isLoaded = true;
});