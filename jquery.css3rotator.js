(function ($) {
  function Css3Rotator(element, options) {
    var defaults = {
      container: '.rotator-wrapper',
      transitionDuration: 1000,
      slideWidth: element.width(),
      transitonInterval: 3000,
      pauseAfterTransition: true
    };
    var mergedOptions = $.extend(defaults, options);

    var transitionEndEventName = getTransitionEndEventName();
    var slideCount = 0,
      pageIndex = 0,
      slideContainer = null,
      slides = null;

    var timer = null;

    init();

    function init() {
      slideContainer = element.find(mergedOptions.container);
      slides = slideContainer.children();
      slideCount = slides.length;
      slideContainer.width(mergedOptions.slideWidth * slideCount);
      //debugger;
      slides.width(element.width());
      bindEvents();

      slideContainer.css({
        "-webkit-transition-duration": mergedOptions.transitionDuration,
        "-moz-transition-duration": mergedOptions.transitionDuration,
        "-o-transition-duration": mergedOptions.transitionDuration,
        "transition-duration": mergedOptions.transitionDuration
      });

      slideContainer.css({
        "-webkit-transform:": "translateX(-" + mergedOptions.slideWidth + "px)",
        "-moz-transform:": "translateX(-" + mergedOptions.slideWidth + "px)",
        "-o-transform:": "translateX(-" + mergedOptions.slideWidth + "px)",
        "transform": "translateX(-" + mergedOptions.slideWidth + "px)"
      });
      pageIndex++;
    }

    function roll(pageIndex) {
      console.log("Dot it:", pageIndex);
      var value = 800 * pageIndex;
      value = -value + "px";
      slideContainer.css({
        "-webkit-transform": "translateX(" + value + ")",
        "-moz-transform": "translateX(" + value + ")",
        "-o-transform": "translateX(" + value + ")",
        "transform": "translateX(" + value + ")"
      });

      if (pageIndex === 0) {
        setTimeout(function () {
          console.log("set duration2");
          slideContainer.css({
            "-webkit-transition-duration": mergedOptions.transitionDuration,
            "-moz-transition-duration": mergedOptions.transitionDuration,
            "-o-transition-duration": mergedOptions.transitionDuration,
            "transition-duration": mergedOptions.transitionDuration
          });
          transitionEndEventHandler();
        }, 3000);
      }
    }

    function transitionEndEventHandler(e) {
      pageIndex++;
      if (pageIndex > slideCount - 1) {
        pageIndex = 0;
        console.log("set duraion to zero");
        slideContainer.css({
          "-webkit-transition-duration": "0s",
          "-moz-transition-duration": "0s",
          "-o-transition-duration": "0s",
          "transition-duration": "0s"
        });
      } else {
        console.log("set duration");
        slideContainer.css({
          "-webkit-transition-duration": mergedOptions.transitionDuration,
          "-moz-transition-duration": mergedOptions.transitionDuration,
          "-o-transition-duration": mergedOptions.transitionDuration,
          "transition-duration": mergedOptions.transitionDuration
        });
      }

      setTimeout(function () {
        roll(pageIndex);
      }, mergedOptions.pauseAfterTransition ? mergedOptions.transitonInterval : 0);
    }

    function bindEvents() {
      slideContainer.on(transitionEndEventName, transitionEndEventHandler);
    }
  }
  
  function getTransitionEndEventName() {
    var i,
      undefined,
      el = document.createElement('div'),
      transitions = {
        'transition':'transitionend',
        'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      };
    
    for (i in transitions) {
      if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
        return transitions[i];
      }
    }
    
    //TODO: throw 'TransitionEnd event is not supported in this browser';
    return '';
  }
  
  $.fn.css3Rotator = function (options) {
    // Using the each() method to loop through the elements
    return this.each(function(index, item){
      var rotatorObj = new Css3Rotator($(item), options);
    });
  };
})(jQuery);