/**
 * HARSATH ALI - SWIPER.JS CONFIGURATION
 * Carousel systems for Certifications and Project Media Showcases
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Certificate Carousel if Swiper is present
  const certSwiperContainer = document.querySelector('.cert-swiper-container');
  if (certSwiperContainer && typeof Swiper !== 'undefined') {
    const certSwiper = new Swiper('.cert-swiper-container', {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      centeredSlides: false,
      speed: 600,
      loop: false,
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      pagination: {
        el: '.cert-swiper-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.cert-swiper-next',
        prevEl: '.cert-swiper-prev'
      },
      breakpoints: {
        640: {
          slidesPerView: 1.5,
          spaceBetween: 24
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 28
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 32
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 32
        }
      }
    });

    window.certSwiper = certSwiper;
  }

  // 2. Initialize Project Demo Swiper if present
  const projectSwiperContainer = document.querySelector('.project-swiper-container');
  if (projectSwiperContainer && typeof Swiper !== 'undefined') {
    const projectSwiper = new Swiper('.project-swiper-container', {
      slidesPerView: 1,
      spaceBetween: 20,
      grabCursor: true,
      speed: 500,
      pagination: {
        el: '.project-swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.project-swiper-next',
        prevEl: '.project-swiper-prev'
      }
    });

    window.projectSwiper = projectSwiper;
  }
});
