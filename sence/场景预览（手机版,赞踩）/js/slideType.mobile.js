//初始化swiper，上下惯性翻页方式 20160123增加
function initSwiperType3(options) {
    var id = options.id;
    mySwiper = new Swiper('#' + id, {
        direction: 'vertical',
        speed: 400,
        mousewheelControl: true,
        autoplay: window.autoPlay > 0 ? window.autoPlay : 0, // 20160123 自动播放
        autoplayDisableOnInteraction: false,                 // 20160123 自动播放
        watchSlidesProgress: true,
        onInit: function (swiper) {
            swiperAnimateCache(swiper); //隐藏动画元素 
            swiperAnimate(swiper); //初始化完成开始动画   
            updatePageNow(swiper.activeIndex + 1);
            swiper.myactive = 0;
        },
        onSlideChangeEnd: function (swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画            
            updatePageNow(swiper.activeIndex + 1);
        },
        onSliderMove: function (swiper, event) {
            hideDb();
        },
        onProgress: function (swiper) {
            for (var i = 0; i < swiper.slides.length; i++) {
                var slide = swiper.slides[i];
                var progress = slide.progress;
                var translate, boxShadow;
                translate = progress * swiper.height * 0.8;
                scale = 1 - Math.min(Math.abs(progress * 0.8), 1);
                boxShadowOpacity = 0;
                slide.style.boxShadow = '0px 0px 10px rgba(0,0,0,' + boxShadowOpacity + ')';
                if (i == swiper.myactive) {
                    es = slide.style;
                    es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')';
                    es.zIndex = 0;
                } else {
                    es = slide.style;
                    es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = '';
                    es.zIndex = 1;
                }
            }
        },
        onSetTransition: function (swiper, speed) {
            for (var i = 0; i < swiper.slides.length; i++) {
                es = swiper.slides[i].style;
                es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
            }
        },
        onTransitionEnd: function (swiper) {
            swiper.myactive = swiper.activeIndex;
            updatePageNow(swiper.activeIndex + 1);
        }
    });
}
//初始化swiper，左右惯性翻页方式 20160123增加
function initSwiperType4(options) {
    var id = options.id;
    mySwiper = new Swiper('#' + id, {
        speed: 400,
        mousewheelControl: true,
        autoplay: window.autoPlay > 0 ? window.autoPlay : 0, // 20160123 自动播放
        autoplayDisableOnInteraction: false,                 // 20160123 自动播放
        watchSlidesProgress: true,
        onInit: function (swiper) {
            swiperAnimateCache(swiper); //隐藏动画元素 
            swiperAnimate(swiper); //初始化完成开始动画
            updatePageNow(swiper.activeIndex + 1);
            swiper.myactive = 0;
        },
        onSlideChangeEnd: function (swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画    
            updatePageNow(swiper.activeIndex + 1);
        },
        onSliderMove: function (swiper, event) {
            hideDb();
        },
        onProgress: function (swiper) {
            for (var i = 0; i < swiper.slides.length; i++) {
                var slide = swiper.slides[i];
                var progress = slide.progress;
                var translate, boxShadow;
                translate = progress * swiper.height * 0.8;
                scale = 1 - Math.min(Math.abs(progress * 0.8), 1);
                boxShadowOpacity = 0;
                slide.style.boxShadow = '0px 0px 10px rgba(0,0,0,' + boxShadowOpacity + ')';
                if (i == swiper.myactive) {
                    es = slide.style;
                    es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(' + (translate) + 'px,0,0) scale(' + scale + ')';
                    es.zIndex = 0;
                } else {
                    es = slide.style;
                    es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = '';
                    es.zIndex = 1;
                }
            }
        },
        onSetTransition: function (swiper, speed) {
            for (var i = 0; i < swiper.slides.length; i++) {
                es = swiper.slides[i].style;
                es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
            }
        },
        onTransitionEnd: function (swiper) {
            swiper.myactive = swiper.activeIndex;
            updatePageNow(swiper.activeIndex + 1);
        }
    });
}