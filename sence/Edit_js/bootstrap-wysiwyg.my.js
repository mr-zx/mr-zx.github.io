$(function () {
    function initToolbarBootstrapBindings() {
        //$('a[title]').tooltip({ container: 'body' });
        $('.dropdown-menu input').click(function () { return false; })
        .change(function () { $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); })
        .keydown('esc', function () { this.value = ''; $(this).change(); });
    };
    initToolbarBootstrapBindings();
});

function showBtnToolbar(jq) {
    $("#editArea").removeAttr('id contenteditable');
    jq.attr('id', "editArea");
    $("#editArea").wysiwyg();
    var t = jq.position().top - ((jq[0].offsetHeight - jq.height()) / 2);
    if ($("#btn-toolbar").css('display') == 'none')
        $("#btn-toolbar").show();
    $("#btn-toolbar").css('top', (t - 40) + 'px');
}
function lineHeightDown() {
    var o = document.getElementById("editArea");
    var lh = parseFloat(o.style.lineHeight);
    o.style.lineHeight = lh + 0.1;
}
function lineHeightUp() {
    var o = document.getElementById("editArea");
    var lh = parseFloat(o.style.lineHeight);
    o.style.lineHeight = lh - 0.1;
}
