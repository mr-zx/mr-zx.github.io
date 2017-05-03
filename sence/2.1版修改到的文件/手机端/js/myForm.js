
//绑定视频按钮点击事件
function initForm() {
    $('button.form-submit').unbind().click(submitForm);
}
/* 提交表单方法
 * 1. 全部为空，不允许为空，有一个填写了就可以提交
 * 2. 手机、邮箱需要验证格式额正确性
 */
function submitForm() {
    var empty = true;
    var errorInfo = '';
    var dataArr = [];
    var oneDataArr = [];
    $('textarea[name="form-input"]').each(function () {
        var $this = $(this);
        var type = $this.parent('.el-box-contents').attr('ctype');
        var name = $this.attr('placeholder');
        var data = $this.val();
        if (data != '') {
            empty = false;
            var isError = checkDataIsRight(data, type);
            if (!isError) {
                oneDataArr = [name, data];
                dataArr.push(oneDataArr);
            }
            else {
                console.log(1);
                errorInfo = isError;
                return false;
            }
        }
    });
    if (empty) {
        errorInfo = '请填写表单';
    }
    if (errorInfo != '') {
        alert(errorInfo);
        return false;
    }
    alert('提交成功！');
    var postdata = { "data": dataArr };
    $.ajax({
        url: "xxx.php", type: "post",
        data: postdata,        
        error: function () {
            console.log('出错了，请重试');
        },
        success: function (data, status) {
            if (status == 'success') {
               
            }
        }
    });
}
//验证提交的数据是否合法
function checkDataIsRight(data, type) {
    var error = false;
    if (type == '503') {
        var reg1 = /^1[3|4|5|7|8]\d{9}$/;
        var reg2 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        if (!(reg1.test(data) || reg2.test(data)))
            error = '请输入有效的手机号或电话！';
    }
    else if (type == '504') {
        var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!reg.test(data))
            error = '请输入有效的邮箱！';
    }
    return error;
}