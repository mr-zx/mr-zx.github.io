/*#############################################################
Name: Select美化
Version: 1.0
Author: zhangxu
#############################################################*/
function selectPretty(selectId, change) {
    var select = $("#" + selectId).hide();
    var selectedTxt = $("#" + selectId + " option:selected").text();
    $('#select_' + selectId).remove();
    var div = $('<div id="select_' + selectId + '" class="select_box"></div>');
    var select_info = $('<div id="select_info_' + selectId + '" class="tag_select">' + selectedTxt + '</div>');
    var ul = $('<ul id="options_' + selectId + '" class="tag_options"></ul>');
    div.append(select_info).append(ul);
    select.after(div);
    select.children().each(function () {
        var tagName = this.tagName;
        if (tagName == "OPTION") {
            var li = $('<li data-value=' + this.value + '>' + $(this).html() + '</li>');
            ul.append(li);
            if (this.value == select.val())
                li.attr('id', "selected_" + selectId).attr("class", "open_selected");
        }
        else if (tagName == "OPTGROUP") {
            var optgroupDiv = $('<div class="optgroup"><div class="optgroupName">' + this.label + '</div></div>')
            $(this).children('option').each(function () {
                var li = $('<li data-value=' + this.value + '>' + $(this).html() + '</li>');
                optgroupDiv.append(li);
                if (this.value == select.val())
                    li.attr('id', "selected_" + selectId).attr("class", "open_selected");
            });
            ul.append(optgroupDiv);
        }
    });
    ul.find('li').click(function (e) {
        e.stopPropagation();
        var li = $(this);
        ul.hide();
        select_info.attr("class", "tag_select").html(li.text());
        if (li.hasClass("open_selected")) return;
        $("#selected_" + selectId).removeAttr("id").removeAttr("class");
        li.attr('id', "selected_" + selectId).attr("class", "open_selected");
        var v = li.attr('data-value');
        select.val(v);
        if (change) change(v);
    });
    select_info.click(function (e) {
        e.stopPropagation();
        if (select_info.hasClass("tag_select_open")) {
            ul.hide();
            select_info.attr("class", "tag_select");
        } else {
            closeSelects();
            ul.show();
            select_info.attr("class", "tag_select_open");
        }
    });
    ul.find("div.optgroupName").click(function (e) {
        e.stopPropagation();
    });
    ul.hover(function () { }, function () {
        ul.fadeOut("100");        
        select_info.attr("class", "tag_select");
    });
}
//设置默认被选中选项
function setDefaultOption(selectId, value) {
    $("#" + selectId).val(value);
    var ul = $('#options_' + selectId);
    var li = ul.find('li[data-value="' + value + '"]');
    //$("#selected_" + selectId).removeAttr("id").removeAttr("class");
    //li.attr('id', "selected_" + selectId).attr("class", "open_selected");
    //$('#select_info_' + selectId).text(li.text());
    li[0].click();
}
//关闭所有显示的下拉列表
function closeSelects() {
    var tag_select_open = $("div.tag_select_open");
    tag_select_open.siblings("ul.tag_options").hide();
    tag_select_open.attr("class", "tag_select");
}
$(function () {
    $('body').click(function () {
        closeSelects();
    });
});