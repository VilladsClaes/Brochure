/*!
 * Eventur – site JavaScript
 *
 * Afhænger af jQuery samt temaets plugins (Owl Carousel og Magnific Popup),
 * som indlæses før denne fil. Al anden interaktion er skrevet i vanilla JS.
 */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var REVEAL_EFFECTS = ['fadeIn', 'fadeInLeft', 'fadeInRight', 'fadeInUp'];

  function revealElement(el) {
    if (el.classList.contains('ftco-animated')) return;
    var effect = el.getAttribute('data-animate-effect');
    el.classList.add(REVEAL_EFFECTS.indexOf(effect) !== -1 ? effect : 'fadeInUp', 'ftco-animated');
  }

  // Afslører indhold, når det kommer i viewport. Falder tilbage til at vise
  // alt med det samme, hvis IntersectionObserver mangler, eller hvis brugeren
  // har slået animationer fra.
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.ftco-animate'));

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(revealElement);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    items.forEach(function (el) { observer.observe(el); });
  }

  function initUi() {
    // Sideindlæsnings-loader
    $('#ftco-loader').removeClass('show');

    // Slidere
    $('.home-slider').owlCarousel({
      loop: true, autoplay: true, autoplayTimeout: 6000, autoplayHoverPause: true,
      margin: 0, animateOut: 'fadeOut', animateIn: 'fadeIn', nav: false, items: 1
    });
    $('.carousel').owlCarousel({
      center: true, loop: true, items: 1, margin: 30, nav: false, dots: true
    });
    $('.carousel1').owlCarousel({
      loop: false, items: 1, margin: 30, nav: false,
      responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 3 } }
    });

    // Fuldbredde til menu-overlay
    var fullHeight = function () { $('.js-fullheight').css('height', $(window).height()); };
    fullHeight();
    $(window).on('resize', fullHeight);

    // Burgermenu
    function closeMenu() {
      $('body').removeClass('menu-show');
      $('#colorlib-main-nav > .js-colorlib-nav-toggle').removeClass('show');
    }
    $('.js-colorlib-nav-toggle').on('click', function (event) {
      event.preventDefault();
      if ($('body').hasClass('menu-show')) {
        closeMenu();
      } else {
        $('body').addClass('menu-show');
        $('#colorlib-main-nav > .js-colorlib-nav-toggle').addClass('show');
      }
    });
    $(document).on('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    // Fremhæv det aktive menupunkt ud fra sidens data-section
    var section = document.body.getAttribute('data-section');
    if (section) {
      $('#colorlib-main-nav a[data-nav="' + section + '"]').closest('li').addClass('active');
    }

    // Billed- og videopopups
    $('.image-popup').magnificPopup({
      type: 'image',
      gallery: { enabled: true, navigateByImgClick: true, preload: [0, 1] },
      image: { verticalFit: true },
      zoom: { enabled: true, duration: 300 }
    });
    $('.popup-inline').magnificPopup({
      type: 'inline', mainClass: 'mfp-fade', removalDelay: 160
    });
    $('.popup-vimeo, .popup-youtube').magnificPopup({
      type: 'iframe', mainClass: 'mfp-fade', removalDelay: 160, preloader: false, fixedContentPos: false
    });

    // Årstal i footeren
    $('[data-current-year]').text(new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.jQuery) {
      window.jQuery(function () {
        initUi();
        // Køres efter sliderne, så også deres klonede elementer bliver afsløret.
        initReveal();
      });
    } else {
      initReveal();
    }
  });
})();
