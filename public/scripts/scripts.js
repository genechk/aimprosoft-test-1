$(document).ready(() => {
  const tabletWidth = 767;
  const desktopWidth = 1280;

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
        breakpoint: tabletWidth,
        settings: tabletDefaults,
      },
      {
        breakpoint: desktopWidth,
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
        breakpoint: tabletWidth,
        settings: {
          ...tabletDefaults,
          initialSlide: 1,
          arrows: true,
          // nextArrow: $('#arrow-next'),
          // prevArrow: $('#arrow-prev'),
        },
      },
      // Avoids duplicate products but makes extra breakpoint
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 6,
          initialSlide: 0,
          variableWidth: false,
        },
      },
      {
        breakpoint: desktopWidth,
        settings: { ...desktopDefaults },
      },
    ],
  };

  const galleryParams = {
    ...defaults,
    initialSlide: 2,
    responsive: [
      {
        breakpoint: tabletWidth,
        settings: {
          ...tabletDefaults,
        },
      },
      {
        breakpoint: desktopWidth,
        settings: 'unslick',
      },
    ],
  };

  const customerParams = {
    ...defaults,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: tabletWidth,
        settings: 'unslick',
      },
    ],
  };

  // Set up Slick carousel
  $('.promotions-wrapper').slick(heroParams);
  $('.products-slider').slick(productParams);
  $('.gallery').slick(galleryParams);
  $('.customer-cards').slick(customerParams);

  // Disable 'inactive' links to prevent them from scrolling to top of the page
  const disableLinks = (event) => event.preventDefault();
  const enableLinks = () => {
    $('.gallery').find('.photo-link').unbind('click', disableLinks);
  };

  const updateDisabledLinks = () => {
    $('.gallery').find('.photo-link').bind('click', disableLinks);
    setTimeout(() => {
      $('.gallery')
        .find('.photo')
        .filter('.slick-current')
        .find('.photo-link')
        .unbind('click', disableLinks);
    });
  };

  // Call function once and make sure it is called after each change
  updateDisabledLinks();
  $('.gallery').on('afterChange', updateDisabledLinks);

  $(window).resize(() => {
    if (window.innerWidth <= tabletWidth) {
      $('.customer-cards').slick('setOption', '', '', true);
      $('.gallery').on('afterChange', updateDisabledLinks);
      return;
    }
    $('.gallery').unbind('afterChange', updateDisabledLinks);

    if (window.innerWidth <= desktopWidth) {
      $('.gallery').slick('setOption', '', '', true);
    }
  });
});
