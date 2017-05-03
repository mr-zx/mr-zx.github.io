function showFullOrHide(divId) {
    var obj = $("#" + divId);
    var showB = obj.siblings('.showWordsBtn');
    var hideB = obj.siblings('.hideWordsBtn');
    var h = parseInt(obj.css('height').replace(/[^0-9]/ig, ""));
    var zdh = parseInt(obj.attr('zdheight').replace(/[^0-9]/ig, ""));
    var sch = parseInt(obj[0].scrollHeight);
    var tarH = h > zdh ? zdh : sch;
    obj.animate({ 'height': tarH + 'px' }, 200, function () {
        if (h > zdh) {
            hideB.hide(0);
            showB.show(0);
        } else {
            showB.hide(0);
            hideB.show(0);
        }
    });
}