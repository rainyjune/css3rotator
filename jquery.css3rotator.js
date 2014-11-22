(function ($) {
  function Css3Rotator(element, options) {
    var defaults = {
      container: '.rotator-wrapper',
      transitionDuration: 1000,
      slideWidth: 800,
      transitonInterval: 3000,
      pauseAfterTransition: true
    };

    var mergedOptions = $.extend(defaults, options);

    var transitionEndEventName = getTransitionEndEventName();
    var slideCount = 0,
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

      if (x === 0) {
        setTimeout(function () {
          console.log("set duration2");
          slideContainer.css({ "transition-duration": mergedOptions.transitionDuration });
          transitionEndEventHandler();
        }, 3000);
      }
    }

    function transitionEndEventHandler(e) {
      pageIndex++;
      if (pageIndex > slideCount - 1) {
        pageIndex = 0;
        console.log("set duraion to zero");
        slideContainer.css({ "transition-duration": "0s" });
      } else {
        console.log("set duration");
        slideContainer.css({ "transition-duration": mergedOptions.transitionDuration });
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