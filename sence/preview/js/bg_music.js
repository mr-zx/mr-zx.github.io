function initBgMusic() {
    yinfushow();
    $("#audioBtn").click(function () {
        var music = document.getElementById("bgMusic");
        if (music.paused) playMusic(); else pauseMusic();
    });
    //解决自动播放bug
    var touchstartPlay = false;
    document.addEventListener("touchstart", function () { if (!touchstartPlay) { document.getElementById("bgMusic").play() } touchstartPlay = true }, false);
}
function pauseMusic() {
    document.getElementById("bgMusic").pause();
    $("#audioBtn").removeClass("play mscPlay");
    $("#mscFont").text('关闭').fadeIn();
    setTimeout(function () { $("#mscFont").fadeOut(); }, 1000);
    $("#yinfu").html('');
}
function playMusic() {
    document.getElementById("bgMusic").play();
    $("#audioBtn").addClass("play mscPlay");
    $("#mscFont").text('开启').fadeIn();
    setTimeout(function () { $("#mscFont").fadeOut(); }, 1000);
    yinfushow();
}
function yinfushow() {
    var h = ''
        + '<span class="mscAni01" style="position: absolute; left: 0px; top: 30px;"><img src="images/musicalNotes_b.png"></span>'
        + '<span class="mscAni02" style="position: absolute; left: 2px; top: 30px;"><img src="images/musicalNotes_g.png"></span>'
        + '<span class="mscAni03" style="position: absolute; left: 2px; top: 30px;"><img src="images/musicalNotes_y.png"></span>'
        + '<span class="mscAni04" style="position: absolute; left: 4px; top: 30px;"><img src="images/musicalNotes_z.png"></span>'
        + '<span class="mscAni05" style="position: absolute; left: 4px; top: 30px;"><img src="images/musicalNotes_zo.png"></span>'
        + '<span class="mscAni06" style="position: absolute; left: -4px; top: 30px;"><img src="images/musicalNotes_g.png"></span>'
        + '<span class="mscAni07" style="position: absolute; left: -4px; top: 30px;"><img src="images/musicalNotes_y.png"></span>'
        + '<span class="mscAni08" style="position: absolute; left: -2px; top: 30px;"><img src="images/musicalNotes_z.png"></span>'
        + '<span class="mscAni09" style="position: absolute; left: -1px; top: 30px;"><img src="images/musicalNotes_zo.png"></span>';
    $("#yinfu").html(h);
}