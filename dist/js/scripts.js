"use strict";

(function ($) {
  // Breakpoints
  var phone = 480,
      phablet = 768,
      tablet = 992,
      desktop = 1200;
  /**
   * Mobile Menu
   */

  var $body = $('body'),
      $headerNav = $('.header-nav'); // Open mobile menu

  function open_mobile_navigation() {
    $headerNav.addClass('header-nav-visible');
    $body.addClass('mobile-menu-is-open');
  } // Close mobile menu


  function close_mobile_navigation() {
    $body.removeClass('mobile-menu-is-open');
    $headerNav.removeClass('header-nav-visible');
  } // If the user resizes the browser and the mobile menu is open - then close the mobile menu


  $(window).resize(function () {
    if ($(document).width() >= tablet) close_mobile_navigation();
  }); // Mobile menu icon click event

  $(document).ready(function () {
    $('#open-mobile-menu').on('click', function (e) {
      open_mobile_navigation();
    });
    $('#close-mobile-menu').on('click', function (e) {
      close_mobile_navigation();
    });
  });
  /**
   * Mobile Header Slide In/Out - Hide and Show header on scroll down and up
   */

  var didScroll = false,
      lastScrollTop = 0;
  var $header = $('#header'),
      navbarHeight = $header.outerHeight();
  $(window).scroll(function (event) {
    didScroll = true;
  });
  setInterval(function () {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(window).scrollTop(); // Make sure they scroll more than 5px

    if (Math.abs(lastScrollTop - st) <= 5) return; // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.

    if (st > lastScrollTop && st > navbarHeight) {
      // Scroll Down
      $header.removeClass('nav-down').addClass('nav-up');
    } else if (st + $(window).height() < $(document).height()) {
      // Scroll Up
      $header.removeClass('nav-up').addClass('nav-down');
    }

    lastScrollTop = st;
  }

  function mastheadParallax() {
    var pos = $(window).scrollTop() - 104;
    $('.container').each(function () {
      $('.masthead').css('background-position', '50% ' + Math.round(pos * 0.2) + 'px');
    });
  }

  ;
  $(window).bind('scroll', mastheadParallax);
})(jQuery);