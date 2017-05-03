<?php
header("Content-type: text/html; charset=utf-8");     
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $shot = new Img_shot();
    $dst_w = 273;
    $dst_h = $_POST['h']/$_POST['w']*$dst_w;
    
    $shot->initialize($_POST['src'],$_POST['x'],$_POST['y'],$_POST['w'],$_POST['h'],$dst_w,$dst_h);    
    echo $shot->generate_shot();
}
//75.01831501831502,37.50697674418605,405.5677655677656,638.7320930232559,
// $shot = new Img_shot();
// $shot->initialize('images/4.jpg',0,0,75,75,100,100);    
// echo $shot->generate_shot();
class Img_shot  
{  
      
    private $filename;  
    private $ext;  
    private $x;  //源的 X 坐标点
    private $y;  //源的 y 坐标点
    private $src_w; //源图象的宽度 
    private $src_h; //源图象的高度 
    private $dst_w;  //目标图象的宽度 
    private $dst_h;  //目标图象的高度
    private $jpeg_quality = 90;  
    /** 
     * 构造器 
     */  
    public function __construct()  
    {  
        
    }  
    /** 
     * 初始化截图对象     
     */  
    public function initialize($filename,$x,$y,$src_w,$src_h,$dst_w,$dst_h)  
    {  
        if(file_exists($filename))  
        {  
            $this->filename = $filename;  
            $pathinfo = pathinfo($filename);  
            $this->ext = $pathinfo['extension'];  
        }  
        else  
        {  
            $e = new Exception('the file is not exists!',1050);  
            throw $e;  
        }  
        $this->x = $x;  
        $this->y = $y;     
        $this->src_w = $src_w;   
        $this->src_h = $src_h; 
        $this->dst_w = $dst_w;   
        $this->dst_h = $dst_h;    
    }  
    /** 
     * 生成截图 
     * 根据图片的格式，生成不同的截图 
     */  
    public function generate_shot()  
    {  
        switch($this->ext)  
        {  
            case 'jpg':  
                return $this->generate_jpg();  
                break;  
            case 'png':  
                return $this->generate_png();  
                break;  
            case 'gif':  
                return $this->generate_gif();  
                break;  
            default:  
                return false;  
        }  
    }  
    /** 
     * 得到生成的截图的文件名 
     *  
     */  
    private function get_shot_name()  
    {  
        $pathinfo = pathinfo($this->filename);  
        $fileinfo = explode('.',$pathinfo['basename']);  
        //$filename = $fileinfo[0] . '_small.' . $this->ext;  
        //return $pathinfo['dirname'] . '/' .$filename; 
        $filename = 'img'.time().'.'. $this->ext;  
        return 'cutImg' . '/' .$filename;   
    }  
    /** 
     * 生成jpg格式的图片 
     *  
     */  
    private function generate_jpg()  
    {  
        $shot_name = $this->get_shot_name();  
        $img_r = imagecreatefromjpeg($this->filename);  
        $dst_r = ImageCreateTrueColor($this->dst_w, $this->dst_h);  
  
        imagecopyresampled($dst_r,$img_r,0,0,$this->x,$this->y, $this->dst_w,$this->dst_h,$this->src_w,$this->src_h);  
        imagejpeg($dst_r,$shot_name,$this->jpeg_quality);  
        return $shot_name;  
    }  
    /** 
     * 生成gif格式的图片 
     *  
     */  
    private function generate_gif()  
    {  
        $shot_name = $this->get_shot_name();  
        $img_r = imagecreatefromgif($this->filename);  
        $dst_r = ImageCreateTrueColor($this->dst_w, $this->dst_h);  
  
        imagecopyresampled($dst_r,$img_r,0,0,$this->x,$this->y, $this->dst_w,$this->dst_h,$this->src_w,$this->src_h);  
        imagegif($dst_r,$shot_name);  
        return $shot_name;  
    }  
    /** 
     * 生成png格式的图片 
     *  
     */  
    private function generate_png()  
    {  
        $shot_name = $this->get_shot_name();  
        $img_r = imagecreatefrompng($this->filename);  
        $dst_r = ImageCreateTrueColor($this->dst_w, $this->dst_h);  
  
        //===修改透明问题 begin 20151022========
        $c=imagecolorallocatealpha($dst_r , 0 , 0 , 0 ,127);//拾取一个完全透明的颜色
        imagealphablending($dst_r ,false);//关闭混合模式，以便透明颜色能覆盖原画布
        imagefill($dst_r , 0 , 0, $c);//填充
        imagesavealpha($dst_r ,true);//设置保存PNG时保留透明通道信息
        //===修改透明问题 end 20151022==========
        
        imagecopyresampled($dst_r,$img_r,0,0,$this->x,$this->y, $this->dst_w,$this->dst_h,$this->src_w,$this->src_h);  
        imagepng($dst_r,$shot_name);  
        return $shot_name;  
    }  
}       
?>