
//整个场景所有的slide
var json = {
    "sceneId": "156413",//新增
    "fengmian": "images/fm123.jpg",//新增
    "title": "我是标题",//新增
    "desc": "这里是描述",//新增
    "category": "企业",//新增
    "bgMsc": "mp3/paomo.mp3",//新增
    "bgMscName": "泡沫.mp3",//新增
    "slideType": "上下翻页",//新增
    "whoSee": "所有人",//新增
    "autoPlay": "3000", //自动播放，毫秒，新增 20160123
    "slides": [
        {
            "slide": {}
        },
        {
            "slide": {}
        },
        {
            "slide": {}
        },
        {
            "slide": {}
        }
    ]
}


//一个页面,即一个 slide，上面json里的slide，替换 "slide": {} 的大括号
var json = {
    "sceneId": "156413",//新加,场景id
    "pageId": "1",//新加,第几页
    "bgColor": "rgba(0,0,0,0)",//新加，背景色
    "bgUrl": "images/bg_sc06.jpg",//背景图
    "bgEffect": "0",//背景图特效   新增 20160123
    "finger": {},//特效，暂时没用到
    "elements": [
        {
            "id": "213216543",
            "ctype": "1",
            "properties": {
                "ani": {
                    "type": "1",
                    "duration": "2.5",
                    "delay": "2",
                    "count": "1",
                    "direction": ""
                }
            },
            "css": {
                "width": "230",
                "height": "100",
                "left": "50",
                "top": "300",
                "zindex": 2,
                "transform": "100"
            },
            "mid": {
                "css": {
                    "borderWidth": "2",
                    "borderStyle": "dashed",
                    "borderColor": "rgb(255, 0, 0)",
                    "opacity": 0.81,
                    "borderRadius": "14",
                    "box-shadow": "rgb(0, 0, 0) 0px 0px 7px 3px",
                    "backgroundColor": "rgba(209, 133, 133, 0)",
                    "paddingTop": "20"
                }
            },
            "content": {
                "css": {
                    "color": "",
                    "lineHeight": "",
                    "fontFamily": "",
                    "textAlign": "center",
                    "fontSize": "14"
                },
                "src": "images/ad5.jpg",
                "imgLink": "http://www.baidu.com",//图片加超链接  新增 20160123
                "contents": ""
            }
        },
        {
            "id": "213216543",
            "ctype": "1",
            "properties": {
                "ani": {
                    "type": "1",
                    "duration": "2.5",
                    "delay": "2",
                    "count": "1",
                    "direction": ""
                }
            },
            "css": {
                "width": "230",
                "height": "100",
                "left": "50",
                "top": "300",
                "zindex": 2,
                "transform": "100"
            },
            "mid": {
                "css": {
                    "borderWidth": "2",
                    "borderStyle": "dashed",
                    "borderColor": "rgb(255, 0, 0)",
                    "opacity": 0.81,
                    "borderRadius": "14",
                    "box-shadow": "rgb(0, 0, 0) 0px 0px 7px 3px",
                    "backgroundColor": "rgba(209, 133, 133, 0)",
                    "paddingTop": "20"
                }
            },
            "content": {
                "css": {
                    "color": "",
                    "lineHeight": "",
                    "fontFamily": "",
                    "textAlign": "center"
                },
                "src": "images/ad5.jpg",
                "contents": ""
            }
        },
        {
            "id": "1455671369842",
            "ctype": "3",
            "properties": {
                "ani": {
                    "type": "0",
                    "duration": "2",
                    "delay": "0",
                    "count": "1",
                    "direction": ""
                }
            },
            "css": {
                "width": "50",
                "height": "50",
                "left": "135",
                "top": "215",
                "zIndex": "3",
                "transform": "0"
            },
            "mid": {
                "css": {
                    "borderWidth": "0",
                    "borderStyle": "solid",
                    "borderColor": "rgba(0, 0, 0, 1)",
                    "opacity": "1",
                    "borderRadius": "0",
                    "boxShadow": "none",
                    "backgroundColor": "rgba(0, 0, 0, 0)",
                    "paddingTop": "0"
                }
            },
            "content": {
                "src": "",
                "contents": "",
                "videoUrl": "<iframe src=\"http://v.qq.com/iframe/player.html?vid=a0182jckkqa&amp;tiny=0&amp;auto=0\" frameborder=\"0\" width=\"100%\" allowfullscreen=\"\" style=\"position: absolute; min-height: 45%; max-height: 100%; top: 20%;\"></iframe>"//视频  新增 20160123
            }
        },
        {
            "id": "1455671369842",
            "ctype": "501",
            "properties": {
                "ani": {
                    "type": "0",
                    "duration": "2",
                    "delay": "0",
                    "count": "1",
                    "direction": ""
                }
            },
            "css": {
                "width": "200",
                "height": "40",
                "left": "60",
                "top": "60",
                "zIndex": "4",
                "transform": "0"
            },
            "mid": {
                "css": {
                    "borderWidth": "1",
                    "borderStyle": "solid",
                    "borderColor": "rgba(51, 51, 51, 1)",
                    "opacity": "1",
                    "borderRadius": "5",
                    "boxShadow": "none",
                    "backgroundColor": "rgba(0, 0, 0, 0)",
                    "paddingTop": "0"
                }
            },
            "content": {
                "src": "",
                "contents": "",
                "placeholder": "请输入内容"//输入框  新增 20160123
            }
        },
        {
            "id": "1455671369842",
            "ctype": "6",
            "properties": {
                "ani": {
                    "type": "0",
                    "duration": "2",
                    "delay": "0",
                    "count": "1",
                    "direction": ""
                }
            },
            "css": {
                "width": "200",
                "height": "40",
                "left": "60",
                "top": "60",
                "zIndex": "4",
                "transform": "0"
            },
            "mid": {
                "css": {
                    "borderWidth": "1",
                    "borderStyle": "solid",
                    "borderColor": "rgba(51, 51, 51, 1)",
                    "opacity": "1",
                    "borderRadius": "5",
                    "boxShadow": "none",
                    "backgroundColor": "rgba(0, 0, 0, 0)",
                    "paddingTop": "0"
                }
            },
            "content": {
                "src": "",
                "contents": "",
                "btnName": "立即提交"//提交按钮  新增 20160123
            }
        },
        {
            "id": "1455671369842",
            "ctype": "6",
            "properties": {
                "ani": {
                    "type": "0",
                    "duration": "2",
                    "delay": "0",
                    "count": "1",
                    "direction": ""
                }
            },
            "css": {
                "width": "200",
                "height": "40",
                "left": "60",
                "top": "60",
                "zIndex": "4",
                "transform": "0"
            },
            "mid": {
                "css": {
                    "borderWidth": "1",
                    "borderStyle": "solid",
                    "borderColor": "rgba(51, 51, 51, 1)",
                    "opacity": "1",
                    "borderRadius": "5",
                    "boxShadow": "none",
                    "backgroundColor": "rgba(0, 0, 0, 0)",
                    "paddingTop": "0"
                }
            },
            "content": {
                "src": "",
                "contents": "",
                "btnName": "一键拨号",//一键拨号  新增 20160123
                "tel": "010-88886666"//一键拨号  新增 20160123
            }
        }

    ]
}


//写一个完整的页面加载时的json
var json = {
    "sceneId": "156413",
    "fengmian": "images/fm123.jpg",
    "title": "我是标题",
    "desc": "这里是描述",
    "category": "企业",
    "bgMsc": "mp3/paomo.mp3",
    "bgMscName": "泡沫.mp3",
    "slideType": "上下翻页",
    "whoSee": "所有人",
    "slides": [
        {
            "slide": {
                "sceneId": "",
                "pageId": "",
                "bgColor": "rgba(0, 0, 0, 0)",
                "bgUrl": "Edit_img/a15.jpg",
                "elements": [
                    {
                        "id": "1001",
                        "ctype": "1",
                        "properties": {
                            "ani": {
                                "type": "41",
                                "duration": "2",
                                "delay": "0",
                                "count": "2",
                                "direction": ""
                            }
                        },
                        "css": {
                            "width": "200",
                            "height": "250",
                            "left": "60",
                            "top": "20",
                            "zIndex": "1",
                            "transform": "0"
                        },
                        "mid": {
                            "css": {
                                "borderWidth": "0",
                                "borderStyle": "none",
                                "borderColor": "rgba(0, 0, 0, 1)",
                                "opacity": "1",
                                "borderRadius": "0",
                                "boxShadow": "none",
                                "backgroundColor": "rgba(0, 0, 0, 0)",
                                "paddingTop": "0"
                            }
                        },
                        "content": {
                            "src": "Edit_img/a10.jpg",
                            "contents": ""
                        }
                    },
                    {
                        "id": "1002",
                        "ctype": "2",
                        "properties": {
                            "ani": {
                                "type": "37",
                                "duration": "2",
                                "delay": "0",
                                "count": "infinite",
                                "direction": ""
                            }
                        },
                        "css": {
                            "width": "230",
                            "height": "120",
                            "left": "50",
                            "top": "300",
                            "zIndex": "2",
                            "transform": "0"
                        },
                        "mid": {
                            "css": {
                                "borderWidth": "0",
                                "borderStyle": "none",
                                "borderColor": "rgba(0, 0, 0, 1)",
                                "opacity": "1",
                                "borderRadius": "0",
                                "boxShadow": "none",
                                "backgroundColor": "rgba(0, 0, 0, 0)",
                                "paddingTop": "0"
                            }
                        },
                        "content": {
                            "css": {
                                "color": "rgba(0, 0, 0, 1)",
                                "lineHeight": "2",
                                "fontFamily": "微软雅黑",
                                "textAlign": "start",
                                "fontSize": "14px"
                            },
                            "src": "",
                            "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字"
                        }
                    }
                ]
            }
        },
        {
            "slide": {
                "sceneId": "",
                "pageId": "",
                "bgColor": "rgba(0, 0, 0, 0)",
                "bgUrl": "Edit_img/a15.jpg",
                "elements": [
                    {
                        "id": "1001",
                        "ctype": "1",
                        "properties": {
                            "ani": {
                                "type": "41",
                                "duration": "2",
                                "delay": "0",
                                "count": "2",
                                "direction": ""
                            }
                        },
                        "css": {
                            "width": "200",
                            "height": "250",
                            "left": "60",
                            "top": "20",
                            "zIndex": "1",
                            "transform": "0"
                        },
                        "mid": {
                            "css": {
                                "borderWidth": "0",
                                "borderStyle": "none",
                                "borderColor": "rgba(0, 0, 0, 1)",
                                "opacity": "1",
                                "borderRadius": "0",
                                "boxShadow": "none",
                                "backgroundColor": "rgba(0, 0, 0, 0)",
                                "paddingTop": "0"
                            }
                        },
                        "content": {
                            "src": "Edit_img/a10.jpg",
                            "contents": ""
                        }
                    },
                    {
                        "id": "1002",
                        "ctype": "2",
                        "properties": {
                            "ani": {
                                "type": "37",
                                "duration": "2",
                                "delay": "0",
                                "count": "infinite",
                                "direction": ""
                            }
                        },
                        "css": {
                            "width": "230",
                            "height": "120",
                            "left": "50",
                            "top": "300",
                            "zIndex": "2",
                            "transform": "0"
                        },
                        "mid": {
                            "css": {
                                "borderWidth": "0",
                                "borderStyle": "none",
                                "borderColor": "rgba(0, 0, 0, 1)",
                                "opacity": "1",
                                "borderRadius": "0",
                                "boxShadow": "none",
                                "backgroundColor": "rgba(0, 0, 0, 0)",
                                "paddingTop": "0"
                            }
                        },
                        "content": {
                            "css": {
                                "color": "rgba(0, 0, 0, 1)",
                                "lineHeight": "2",
                                "fontFamily": "微软雅黑",
                                "textAlign": "start",
                                "fontSize": "14px"
                            },
                            "src": "",
                            "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字"
                        }
                    }
                ]
            }
        },
        {
            "slide": {
                "sceneId": "",
                "pageId": "",
                "bgColor": "rgba(0, 0, 0, 0)",
                "bgUrl": "Edit_img/a15.jpg",
                "elements": [
                    {
                        "id": "1001",
                        "ctype": "1",
                        "properties": {
                            "ani": {
                                "type": "41",
                                "duration": "2",
                                "delay": "0",
                                "count": "2",
                                "direction": ""
                            }
                        },
                        "css": {
                            "width": "200",
                            "height": "250",
                            "left": "60",
                            "top": "20",
                            "zIndex": "1",
                            "transform": "0"
                        },
                        "mid": {
                            "css": {
                                "borderWidth": "0",
                                "borderStyle": "none",
                                "borderColor": "rgba(0, 0, 0, 1)",
                                "opacity": "1",
                                "borderRadius": "0",
                                "boxShadow": "none",
                                "backgroundColor": "rgba(0, 0, 0, 0)",
                                "paddingTop": "0"
                            }
                        },
                        "content": {
                            "src": "Edit_img/a10.jpg",
                            "contents": ""
                        }
                    },
                    {
                        "id": "1002",
                        "ctype": "2",
                        "properties": {
                            "ani": {
                                "type": "37",
                                "duration": "2",
                                "delay": "0",
                                "count": "infinite",
                                "direction": ""
                            }
                        },
                        "css": {
                            "width": "230",
                            "height": "120",
                            "left": "50",
                            "top": "300",
                            "zIndex": "2",
                            "transform": "0"
                        },
                        "mid": {
                            "css": {
                                "borderWidth": "0",
                                "borderStyle": "none",
                                "borderColor": "rgba(0, 0, 0, 1)",
                                "opacity": "1",
                                "borderRadius": "0",
                                "boxShadow": "none",
                                "backgroundColor": "rgba(0, 0, 0, 0)",
                                "paddingTop": "0"
                            }
                        },
                        "content": {
                            "css": {
                                "color": "rgba(0, 0, 0, 1)",
                                "lineHeight": "2",
                                "fontFamily": "微软雅黑",
                                "textAlign": "start",
                                "fontSize": "14px"
                            },
                            "src": "",
                            "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字"
                        }
                    }
                ]
            }
        },
        {
            "slide": {
                "sceneId": "",
                "pageId": "",
                "bgColor": "rgba(0, 0, 0, 0)",
                "bgUrl": "Edit_img/a15.jpg",
                "elements": [
                    {
                        "id": "1001",
                        "ctype": "1",
                        "properties": {
                            "ani": {
                                "type": "41",
                                "duration": "2",
                                "delay": "0",
                                "count": "2",
                                "direction": ""
                            }
                        },
                        "css": {
                            "width": "200",
                            "height": "250",
                            "left": "60",
                            "top": "20",
                            "zIndex": "1",
                            "transform": "0"
                        },
                        "mid": {
                            "css": {
                                "borderWidth": "0",
                                "borderStyle": "none",
                                "borderColor": "rgba(0, 0, 0, 1)",
                                "opacity": "1",
                                "borderRadius": "0",
                                "boxShadow": "none",
                                "backgroundColor": "rgba(0, 0, 0, 0)",
                                "paddingTop": "0"
                            }
                        },
                        "content": {
                            "src": "Edit_img/a10.jpg",
                            "contents": ""
                        }
                    },
                    {
                        "id": "1002",
                        "ctype": "2",
                        "properties": {
                            "ani": {
                                "type": "37",
                                "duration": "2",
                                "delay": "0",
                                "count": "infinite",
                                "direction": ""
                            }
                        },
                        "css": {
                            "width": "230",
                            "height": "120",
                            "left": "50",
                            "top": "300",
                            "zIndex": "2",
                            "transform": "0"
                        },
                        "mid": {
                            "css": {
                                "borderWidth": "0",
                                "borderStyle": "none",
                                "borderColor": "rgba(0, 0, 0, 1)",
                                "opacity": "1",
                                "borderRadius": "0",
                                "boxShadow": "none",
                                "backgroundColor": "rgba(0, 0, 0, 0)",
                                "paddingTop": "0"
                            }
                        },
                        "content": {
                            "css": {
                                "color": "rgba(0, 0, 0, 1)",
                                "lineHeight": "2",
                                "fontFamily": "微软雅黑",
                                "textAlign": "start",
                                "fontSize": "14px"
                            },
                            "src": "",
                            "contents": "我是新生成的文字我是新生成的文字我是新生成的文字我是新生成的文字"
                        }
                    }
                ]
            }
        }
    ]
}






