// スライドショー機能
document.addEventListener('DOMContentLoaded', () => {
    if (window.Swiper) {
        new Swiper('.swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            effect: 'coverflow',
            speed: 1500,
        });
    }
});
