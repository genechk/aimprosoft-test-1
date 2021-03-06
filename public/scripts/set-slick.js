$(document).ready(() => {
  const breakpoints = {
    tablet: 767,
    tabletWide: 1000,
    desktop: 1280,
  };

  // Initiate all Slick carousels
  setSlick(breakpoints);

  // Get links to behave predictably with carousel
  fixLinks(breakpoints);
});

/**
 *  Setup for each Slick carousel on the page
 *  (Promotions, Products, Categories, Instagram, Customers)
 */
function setSlick(breakpoints) {
  const { tablet, tabletWide, desktop } = breakpoints;

  // Set up parameters for Slick
  const tabletDefaults = {
    centerMode: false,
    initialSlide: 0,
    touchThreshold: 8,
    speed: 300,
    focusOnSelect: false,
    slidesToShow: 4,
    slidesToScroll: 2,
  };

  const desktopDefaults = {
    centerMode: true,
    centerPadding: '1.4rem',
    slidesToShow: 6,
    slidesToScroll: 1,
    variableWidth: false,
  };

  const defaults = {
    centerMode: true,
    centerPadding: '1.4rem',
    mobileFirst: true,
    variableWidth: true,
    swipeToSlide: true,
    touchThreshold: 8,
    arrows: false,
    speed: 300,
    focusOnSelect: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: tablet,
        settings: tabletDefaults,
      },
      {
        breakpoint: desktop,
        settings: desktopDefaults,
      },
    ],
  };

  const heroParams = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    initialSlide: 2,
    mobileFirst: true,
    swipeToSlide: true,
    dotsClass: 'bullets',
    arrows: false,
    autoplay: true,
    autoplaySpeed: 10000,
  };

  const productParams = {
    ...defaults,
    initialSlide: 2,
    responsive: [
      {
        breakpoint: tablet,
        settings: {
          ...tabletDefaults,
          initialSlide: 1,
          arrows: true,
          // nextArrow: $('#arrow-next'),
          // prevArrow: $('#arrow-prev'),
        },
      },
      // Avoids duplicate products but creates extra breakpoint
      {
        breakpoint: tabletWide,
        settings: {
          slidesToShow: 6,
          initialSlide: 0,
          variableWidth: false,
        },
      },
      {
        breakpoint: desktop,
        settings: { ...desktopDefaults },
      },
    ],
  };

  const photoParams = {
    ...defaults,
    initialSlide: 2,
    responsive: [
      {
        breakpoint: tablet,
        settings: {
          ...tabletDefaults,
        },
      },
      {
        breakpoint: desktop,
        settings: 'unslick',
      },
    ],
  };

  const customerParams = {
    ...defaults,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: tablet,
        settings: 'unslick',
      },
    ],
  };

  // Set up Slick carousel
  $('.promotions-slider').slick(heroParams);
  $('.products-slider').slick(productParams);
  $('.photos-slider').slick(photoParams);
  $('.customers-slider').slick(customerParams);
}

/**
 *  Disables hyperlinks with ambiguous behavior
 *  (like scrolling to top of the page)
 *  on smaller screens. Enables them back on larger ones
 */
function fixLinks(breakpoints) {
  // Noop
  const disable = (event) => event.preventDefault();
  const enable = (sliderTag, linkTag) => {
    $(sliderTag).find(linkTag).unbind('click', disable);
  };

  // Updates links after user interactions
  const update = () => {
    // 1. Disable all links
    $('.photos-slider').find('.photo-link').bind('click', disable);
    $('.customers-slider').find('.customer-link').bind('click', disable);
    $('.products-slider').find('.product-link').bind('click', disable);

    // 2. Enable active links
    setTimeout(() => {
      $('.photos-slider')
        .find('.photo')
        .filter('.slick-current')
        .find('.photo-link')
        .unbind('click', disable);

      $('.customers-slider')
        .find('.customer')
        .filter('.slick-current')
        .find('.customer-link')
        .unbind('click', disable);

      $('.products-slider')
        .find('.product')
        .filter('.slick-current')
        .find('.product-link')
        .unbind('click', disable);
    });
  };

  // Call update once, then make sure it is called after each change
  // update();
  setListeners(update, enable, breakpoints);

  return {
    disable,
    enable,
    update,
  };
}

/**
 *  Updates the page when it is resized
 *  or when active slides are changed
 */
function setListeners(update, enable, breakpoints) {
  const { tablet, tabletWide, desktop } = breakpoints;
  // Choose action based on screen size
  $(window).resize(() => {
    if (window.innerWidth <= tablet) {
      setMobileListeners(update, enable);
      return;
    } else if (window.innerWidth <= desktop) {
      setTabletListeners(update, enable);
      return;
    }
    setDesktopListeners(update, enable);
  });
}

/** Updates for screens < 768px */
function setMobileListeners(update, enable) {
  // Turn on Slick for .customers-slider and .photos-slider on mobile screens
  // (it turns off automatically on wider screens)
  $('.photos-slider, .customers-slider').slick('setOption', '', '', true);

  // Reset links every time any of carousels slide
  $('.photos-slider, .customers-slider, .products-slider').on(
    'afterChange',
    update
  );
}

/** Updates for screens < 1281px */
function setTabletListeners(update, enable) {
  // Turn on Slick for .photos-slider on tablet screens
  $('.photos-slider').slick('setOption', '', '', true);

  // Enable and stop updating hyperlinks on tablet
  enable('.photos-slider', '.photo-link');
  enable('.customers-slider', '.customer-link');
  enable('.products-slider', '.product-link');
  $('.photos-slider, .customers-slider, .products-slider').unbind(
    'afterChange',
    update
  );
}

/** Updates for screens >= 1281px */
function setDesktopListeners(update, enable) {
  // Enable and stop updating hyperlinks on desktop
  enable('.photos-slider', '.photo-link');
  enable('.customers-slider', '.customer-link');
  enable('.products-slider', '.product-link');
  $('.photos-slider, .customers-slider').unbind('afterChange', update);
}
