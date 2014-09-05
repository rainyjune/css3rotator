; (function ($) {
  $.fn.css3Rotator = function (options) {
    var defaults = {
      container: '.rotator-wrapper',
      transitionDuration: 1000,
      slideWidth: 800
    }

    var mergedOptions = $.extend(defaults, options);

    var slideCount = 0,
      element = $(this),
      pageIndex = 0,
      slideContainer = null;

    var timer = null;

    init();

    function init() {
      slideContainer = element.find(mergedOptions.container);
      slideCount = slideContainer.children().length;
      slideContainer.width(mergedOptions.slideWidth * slideCount);
      bindEvents();

      slideContainer.css({"transition-duration": mergedOptions.transitionDuration });

      slideContainer.css({ "transform": "translateX(-800px)" });
    }

    function roll(x) {
      console.log("Dot it:", x);
      var value = 800 * x;
      value = -value + "px";
      slideContainer.css({ "transform": "translateX(" + value + ")" });

      //slideContainer.css({ "transition-duration": mergedOptions.transitionDuration });
      if (x === 0) {
        setTimeout(function () {
          console.log("set duration2");
          slideContainer.css({ "transition-duration": mergedOptions.transitionDuration });
          doIt();
        }, 3000);
      }
    }

    function doIt(e) {
      pageIndex++;

      //console.log(slideContainer.css());
      if (pageIndex > slideCount - 1) {
        pageIndex = 0;
        console.log("set duraion to zero");
        slideContainer.css({ "transition-duration": "0s" });
      } else {
        console.log("set duration");
        slideContainer.css({ "transition-duration": mergedOptions.transitionDuration });
      }
      roll(pageIndex);
      
    }

    function bindEvents() {

      
      
      //document.addEventListener('webkitTransitionEnd', doIt, false);
      document.addEventListener('transitionend', doIt, false);
      //document.addEventListener('MSTransitionEnd', doIt, false);
    }
    return $(this);
  };
})(jQuery);