<?php
header("Content-type: text/html; charset=utf-8");     
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{

    $type = $_POST['type'];
   
    //保存当前页
    if($type=="savePage"){
         $json = $_POST['json'];

        $result = json_encode($json);
    }
    //获取版式模板
    else if($type=="getTpl"){
        $tplId = $_POST['tplId'];

        $tplJson = '{name : "我是json"}';

        $result = json_encode($tplJson);
    }
    //提交设置信息
    else if($type=="submitSetting"){
        $data = $_POST['data'];

    }
    //排序后保存新的顺序
    else if($type=="saveNewSort"){
        $oldNum = $_POST['oldNum'];
        $newNum = $_POST['newNum'];
    }
    //复制一页
    else if($type=="copyOnePage"){
        $pageNum = $_POST['pageNum'];
    }
    //删除一页
    else if($type=="deleteOnePage"){
        $pageNum = $_POST['pageNum'];
    }
    //添加一个空白页
    else if($type=="addOnePage"){
        
        $result = "12313";
    }

    //删除一页
    else if($type=="copyImg"){
        $url = $_POST['url'];
        $target = 'Edit_img/copy/1.png';
        copy($url, $target);
        $result = $target;
    }
    echo $result;
}
  
?>