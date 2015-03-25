(function(factory){
  var $ = (typeof Zepto !== "undefined") ? Zepto : jQuery;
  factory($);
})(function ($) {
  function Css3Rotator(element, options) {
    var defaults = {
      container: '.rotatorWrapper',
      transitionDuration: '5s',
      slideWidth: element.width(), /* TODO  */
      transitonInterval: '2s',
      pauseAfterTransition: true,
      autoPlay: true
    };
    
    var currentTranslateXValue = null;
    
    var mergedOptions = $.extend(defaults, options);

    var transitionEndEventName = getTransitionEndEventName();
    var slideCount = 0, // Original count, starts from 0.
        pageIndex = 0, // Original index, starts from 0.
        slideDisplayCount = 0, // Display page count, start from 0.
        slidePageIndex = 1, // Display page index, start from 0, defaults to 1.
        slideContainer = null,
        slides = null,
        indicators = null,
        timer = null;

    init();

    function init() {
      element.addClass("rotatorRootElement"); // add class
      slideContainer = element.find(mergedOptions.container); // Find the list
      slideContainer.addClass("rotatorWrapper").addClass("flex-it");
      slides = slideContainer.children();
      slideCount = slides.length;
      
      addDuplicatePages();
      slideDisplayCount = slideContainer.children().size();
      
      slideContainer.width(slideDisplayCount + "00%");      
      
      setTranslateXValue(-element.width() + 'px'); //add
      currentTranslateXValue = -element.width();
      
      addIndicator();
      bindEvents();
      setTimeout(function(){
        setTransitionDuration();
        if (mergedOptions.autoPlay) {
          setTransitionDelay();
        }
        autoPlay();
      }, 0);
    }
    
    function addDuplicatePages() {
      var oldPages = slideContainer.children();
      var firstOldPage = oldPages.eq(0);
      var lastOldPage = oldPages.eq(-1);
      slideContainer.prepend(lastOldPage.clone());
      slideContainer.append(firstOldPage.clone());
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
        next();
      }
    }
    
    function updateSlideIndex(isNext) {
      if (isNext) {
        slidePageIndex++;
        if (pageIndex === slideCount -1) {
          pageIndex = 0;
        } else {
          pageIndex++;
        }
      } else{
        slidePageIndex--;
        if (pageIndex === 0) {
          pageIndex = slideCount -1;
        } else {
          pageIndex--;
        }
      }
    }
    
    function setTranslateXValue(value) {
      if (!value) {
        value = element.width() * slidePageIndex;
        currentTranslateXValue = - value;
        value = currentTranslateXValue + "px";
      }
      
      slideContainer.css({
        "-webkit-transform": "translateX(" + value + ")",
        "-moz-transform": "translateX(" + value + ")",
        "-o-transform": "translateX(" + value + ")",
        "transform": "translateX(" + value + ")"
      });
      
    }

    function transitionEndEventHandler() {
      updateIndicatorStatus();
      autoPlay();
      return false;
    }

    function bindEvents() {
      slideContainer.on(transitionEndEventName, transitionEndEventHandler);
      var count = 0;
      $(window).on("orientationchange", handleOrientationChange);
      $(element).on("swipeMy", function(e) {
        enableTransitionDuration();
        count = 0;
        $("#debug").text("count:" + count);
      });
      $(element).on("swipeLeftMy", function(e) {
        console.log("swipeLeft:", e);
        next();
      });
      $(element).on("swipeRightMy", function(e) {
        console.log("swipeRight:", e);
        prev();
      });
      $(element).on("swipeStartMy", function(){
        disableTransitionDuration();
        if (slidePageIndex === slideDisplayCount -1 ) {
          slidePageIndex = 1;
          setTranslateXValue();
        } else if (slidePageIndex === 0) {
          slidePageIndex = slideDisplayCount - 2;
          setTranslateXValue();
        }
      });
      $(element).on("swipeCancelMy", function(){
        enableTransitionDuration();
        setTranslateXValue();
      });
      $(element).on("swipeProgressMy", function(e, e1, e2) {
        count++;
        setTranslateXValue((currentTranslateXValue + e1) + "px");
        console.log("progrsss:", (currentTranslateXValue + e1) + "px");
        $("#debug").text("count:" + count + " progrsss:" + (currentTranslateXValue + e1) + "px");
      });
    }
    
    function handleOrientationChange() {
      slideContainer.addClass("notransition");// Disable transition
      setTimeout(function(){
        setTranslateXValue(); 
        updateIndicatorStatus();
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
    
    function setTransitionDelay() {
      slideContainer.css({
        "-webkit-transition-delay": mergedOptions.transitonInterval,
        "-moz-transition-delay": mergedOptions.transitonInterval,
        "-o-transition-delay": mergedOptions.transitonInterval,
        "transition-delay": mergedOptions.transitonInterval
      });
    }
    
    function disableTransitionDuration() {
      slideContainer.addClass("duration-initial");
    }
    
    function enableTransitionDuration() {
      slideContainer.removeClass("duration-initial");
    }
    
    function addIndicator() {
      var domStr = "<strong class='indicator'>";
      for (var i = 0; i < slideCount; i++) {
        domStr += "<span></span>";
      }
      domStr += "</strong>";
      element.append(domStr);
      indicators = element.find('.indicator').children();
      indicators.eq(0).addClass("current");
    }
    
    function updateIndicatorStatus() {
      indicators.removeClass("current");
      indicators.eq(pageIndex).addClass("current");
    }
    
  }
  
  function getTransitionEndEventName() {
    var i,
      undefined,
      el = document.createElement('div'),
      transitions = {
        'WebkitTransition':'webkitTransitionEnd',
        'transition':'transitionend',
        'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
        'MozTransition':'transitionend'
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
});