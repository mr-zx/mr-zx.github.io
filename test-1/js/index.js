$(function () {
    initBanner();
});
function initBanner() {
    var mySwiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: 3000,
        pagination: '.pagination',
        paginationClickable: true
    });
}