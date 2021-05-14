let DOMElements, menuOpen, cartOpen;

/** Caches all DOM elements in one place */
function getDOMElements() {
  return (DOMElements = DOMElements || {
    body: $('body'),
    navbar: $('.navigation'),
    menuIcon: $('#menu-icon'),
    menu: $('#menu-slideout'),
    menuCloseIcon: $('#close-menu'),
    menuWrapper: $('#menu-slideout').find('.menu-wrapper'),
    menuContent: $('#menu-slideout').find('.menu-content'),
    cart: $('#cart-slideout'),
    cartIcon: $('#cart-icon'),
    cartCloseIcon: $('#close-cart'),
    cartWrapper: $('#cart-slideout').find('.cart-wrapper'),
    overlays: $('.lightbox-overlay'),
  });
}

/** Invoke all functions */
// TODO: Add debounce
$(document).ready(() => {
  // Add window.onscroll listener
  setStickyHeader();

  // Cart, hamburger and cross icons interactions
  setMenuIcons();

  // Set up extended scrollbar in menu
  const scroll = setMenuScrollbar();

  // Menu accordion interactions
  setMenuLinks(scroll);
});

/** Applies fixed header on scroll */
function setStickyHeader() {
  const { body, navbar } = getDOMElements();
  const mobileY = 1;
  const tabletY = 472;
  const desktopY = 722;

  const tabletWidth = 768;
  const desktopWidth = 1281;

  const scrollHandler = () => {
    // Determines scrollY value to activate SH
    const activationY =
      (window.innerWidth < tabletWidth && mobileY) ||
      (window.innerWidth < desktopWidth && tabletY) ||
      desktopY;

    if (window.scrollY < activationY) {
      body.removeClass('sticky-header');
      navbar.removeClass('sticky-header');
      return;
    }

    body.addClass('sticky-header');
    navbar.addClass('sticky-header');
  };

  // Run once on page load and add onscroll listener
  scrollHandler();
  $(window).scroll(scrollHandler);
}

/** Activates listeners on navigation bar icons */
function setMenuIcons() {
  const {
    menuIcon,
    menu,
    menuCloseIcon,
    menuWrapper,
    cart,
    cartIcon,
    cartCloseIcon,
    cartWrapper,
    overlays,
  } = getDOMElements();

  const menuLeftTweak = 31;
  const cartRightTweak = 19;
  const desktop = 1281;

  // Prepare handler functions for navigation icons
  const menuClickHandler = (event) => {
    event.preventDefault();
    menu.addClass('open');
    menuIcon.addClass('menu-open');
    menuOpen = true;

    // Set to 0 on smaller screens
    if (window.innerWidth < desktop) {
      menuWrapper.css({ left: 0 });
      return;
    }
    // Calculates the correct menu position on each click
    // TODO: Maybe, set listener on resize event
    const leftEdge = menuIcon[0].getBoundingClientRect().left;
    menuWrapper.css({ left: `${leftEdge - menuLeftTweak}px` });
  };

  const cartClickHandler = (event) => {
    event.preventDefault();
    cart.addClass('open');
    cartIcon.addClass('cart-open');
    menuOpen = true;
    const screenWidth = window.innerWidth;

    // Set to 0 on smaller screens
    if (screenWidth < desktop) {
      cartWrapper.css({ right: 0 });
      return;
    }

    // Calculates the correct menu position on each click
    // TODO: Maybe, set listener on resize event
    const rightEdge = cartIcon[0].getBoundingClientRect().right;
    const adjusted = window.innerWidth - rightEdge - cartRightTweak;
    cartWrapper.css({ right: `${adjusted}px` });
  };

  const menuCloseHandler = (event) => {
    event.preventDefault();
    menu.removeClass('open');
    menuIcon.removeClass('menu-open');
    menuOpen = false;
  };

  const cartCloseHandler = (event) => {
    event.preventDefault();
    cart.removeClass('open');
    cartIcon.removeClass('cart-open');
    cartOpen = false;
  };

  // Add listeners, Let the page know that icons are interactive now
  cartIcon.click(cartClickHandler).addClass('clickable');
  menuIcon.click(menuClickHandler).addClass('clickable');

  // Add listeners that close menus
  menuCloseIcon.click(menuCloseHandler);
  menuCloseIcon.prev().click(menuCloseHandler);
  cartCloseIcon.click(cartCloseHandler);
  cartCloseIcon.prev().click(cartCloseHandler);
  overlays.click(menuCloseHandler).click(cartCloseHandler);
}

/** Initiates nicescroll-jquery plugin in catalog menu */
function setMenuScrollbar() {
  const { menu, menuContent } = getDOMElements();
  menu.addClass('scroll-initiated');
  // Duplicates CSS but otherwise it forces default styles
  return menuContent.niceScroll({
    cursorcolor: '#000',
    cursorwidth: '5px',
    cursorborder: 'none',
    horizrailenabled: false,
    nativeparentscrolling: false,
    cursorborderradius: '0px',
    emulatetouch: true,
    autohidemode: false,
    hidecursordelay: 600,
    railoffset: {
      left: 5,
    },
  });
}

/** Updates nicescroll when accordion menus get expanded / collapsed */
function updateScrollbar(scroll) {
  const animationDelay = 600;
  const { menu } = getDOMElements();

  // Let’s go to callback hell, baby
  setTimeout(() => {
    scroll.resize();

    // If cursor height is 0 (or falsy), show scrollbar
    if (scroll.cursorheight && scroll.cursorheight > 0) {
      menu.addClass('extended');

      // Twice the animation time — twice the fun (no)
      setTimeout(scroll.resize, 300);
      return;
    }

    // Else, remove class
    menu.removeClass('extended');
  }, animationDelay);
}

/** Makes links in catalog menu clickable */
function setMenuLinks(scroll) {
  const { menu } = getDOMElements();

  // Store all links in menu
  const menuLinks = menu.find('.menu-category');
  const submenuLinks = menu.find('.menu-subcategory');

  // Prepare callbacks
  const noop = (event) => event.preventDefault();
  const toggleSubmenu = (event) => {
    event.preventDefault();

    // Expand / contract Accordion
    $(event.target).parent().toggleClass('open');

    // Resize and update scrollbar
    updateScrollbar(scroll);
  };

  // Bind callbacks to menu links
  menuLinks.click(toggleSubmenu);
  submenuLinks.click(noop);
}
