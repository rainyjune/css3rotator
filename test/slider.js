(function ($) {
  function Css3Rotator(element, options) {
    var defaults = {
      container: '.rotatorWrapper',
      transitionDuration: '5s',
      slideWidth: element.width(), /* TODO  */
      transitonInterval: 2000,
      pauseAfterTransition: true,
      autoPlay: true
    };
    var mergedOptions = $.extend(defaults, options);

    var transitionEndEventName = getTransitionEndEventName();
    var slideCount = 0,
        pageIndex = 0,
        slideContainer = null,
        slides = null,
        timer = null;

    init();

    function init() {
      element.addClass("rotatorRootElement"); // add class
      slideContainer = element.find(mergedOptions.container); // Find the list
      slideContainer.addClass("rotatorWrapper").addClass("flex-it");
      slides = slideContainer.children();
      slideCount = slides.length;
      slideContainer.width(slideCount + "00%");
      setTransitionDuration();
      addIndicator();
      bindEvents();
      autoPlay();
    }
    
    function prev() {
      slidePage(false);
    }
    
    function next() {
      slidePage(true);
    }
    
    function slidePage(isNext) {
      updateSlideIndex(isNext);
      setTranslateXValue();
    }
    
    function autoPlay() {
      if (mergedOptions.autoPlay) {
        setTimeout(function () {
          next();
        }, mergedOptions.pauseAfterTransition ? mergedOptions.transitonInterval : 0);
      }
    }
    
    function updateSlideIndex(isNext) {
      if (isNext) {
        if (pageIndex === slideCount -1) {
          pageIndex = 0;
        } else {
          pageIndex++;
        }
      } else{
          if (pageIndex === 0) {
            pageIndex = slideCount -1;
          } else {
            pageIndex--;
          }
      }
    }
    
    function setTranslateXValue() {
      var value = element.width() * pageIndex;
      value = -value + "px";
      slideContainer.css({
        "-webkit-transform": "translateX(" + value + ")",
        "-moz-transform": "translateX(" + value + ")",
        "-o-transform": "translateX(" + value + ")",
        "transform": "translateX(" + value + ")"
      });
    }

    function transitionEndEventHandler() {
      autoPlay();
      return false;
    }

    function bindEvents() {
      slideContainer.on(transitionEndEventName, transitionEndEventHandler);
      $(window).on("orientationchange", handleOrientationChange);
    }
    
    function handleOrientationChange() {
      slideContainer.addClass("notransition");// Disable transition
      setTimeout(function(){
        setTranslateXValue(); 
        // Resume transition after the orientation change event.
        setTimeout(function(){
          slideContainer.removeClass("notransition"); // Enable transition
          autoPlay();
        }, 0);
      }, 500);
      return false;
    }
    
    function setTransitionDuration() {
      slideContainer.css({
        "-webkit-transition-duration": mergedOptions.transitionDuration,
        "-moz-transition-duration": mergedOptions.transitionDuration,
        "-o-transition-duration": mergedOptions.transitionDuration,
        "transition-duration": mergedOptions.transitionDuration
      });
    }
    
    function addIndicator() {
      var domStr = "<strong class='indicator'>";
      for (var i = 0; i < slideCount; i++) {
        domStr += "<span></span>";
      }
      domStr += "</strong>";
      element.append(domStr);
      element.find('.indicator').children().eq(0).addClass("current");
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