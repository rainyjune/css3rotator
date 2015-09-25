/* global Zepto */

(function(factory){
  var $ = (typeof Zepto !== "undefined") ? Zepto : jQuery;
  factory($);
})(function ($) {
  function Css3Rotator(element, options) {
    var defaults = {
      container: '.rotatorWrapper',
      transitionDuration: '5s',
      slideWidth: element.width(),
      slideHeight: element.height(),
      slideMode: 'horizontal', // "horizontal" or "vertical"
      aspectRatio: 2, // Width/Height, maybe "fullscreen"
      transitonInterval: '2000',
      pauseAfterTransition: true,
      indicatorClass: "indicator",
      indicatorActiveItemClass: "current",
      loop: false,
      autoPlay: true
    };
    
    var isTranslate3dSupported = has3d();
    var translateValuePrefix = isTranslate3dSupported ? "translate3d(" : "translate(";
        translateValuePostfix = isTranslate3dSupported ? ", 0)" : ")";
    
    var currentTranslateXValue = null;
    var currentTranslateYValue = null;
    
    var mergedOptions = $.extend(defaults, options);

    var transitionEndEventName = getTransitionEndEventName();
    var slideCount = 0, // Original count, starts from 0.
        pageIndex = 0, // Original index, starts from 0.
        slideDisplayCount = 0, // Display page count, start from 0.
        slidePageIndex = 0, // Display page index, start from 0, defaults to 0.
        slideContainer = null,
        slides = null,
        indicators = null,
        timer = null;

    var slidePageWidth;
    var slidePageHeight;
    var autoPlayFinished;
    
    init();

    function init() {
      prepareElements() && addStyles() && bindEvents();
    }

    function prepareElements() {
      slideContainer = element.find(mergedOptions.container); // Find the list
      if (slideContainer.size() === 0) {
        throw new Error('The container "' + mergedOptions.container + '" does not exist.');
      }
      addSliderItems();
      slides = slideContainer.children();
      slideCount = slides.length;
      if (slideCount === 0) {
        throw new Error('There are no slides in the container.');
      }
      if (mergedOptions.loop) {
        addDuplicatePages();
        slidePageIndex = 1;
      }
      addIndicator();
      return true;
    }

    function addStyles() {
      element.addClass("rotatorRootElement"); // add class
      setSlideRootHeight();// Set aspect ratio
      slideContainer.addClass("rotatorWrapper").addClass("flex-it");
      slideDisplayCount = slideContainer.children().size();
      var slideContainerWidth = slideDisplayCount + "00%";
      var slideContainerHeight = slideDisplayCount + "00%";
      if (mergedOptions.slideWidth !== element.width()) {
        slideContainerWidth = mergedOptions.slideWidth * slideDisplayCount;
      }
      if (mergedOptions.slideHeight !== element.height()) {
        slideContainerHeight = mergedOptions.slideHeight * slideDisplayCount;
      }
      if (mergedOptions.slideMode === "horizontal") {
        slideContainer.addClass("flex-row").width(slideContainerWidth);
      } else {
        slideContainer.addClass("flex-col").height(slideContainerHeight).width("100%");
      }
      slidePageWidth = slideContainer.children().eq(0).width();
      slidePageHeight = slideContainer.children().eq(0).height();
      
      if (mergedOptions.loop) {
        if (mergedOptions.slideMode === "horizontal") {
          setTranslateXValue(-mergedOptions.slideWidth + 'px'); //add
          currentTranslateXValue = - mergedOptions.slideWidth;
        } else {
          setTranslateYValue(-mergedOptions.slideHeight + 'px'); //add
          currentTranslateYValue = - mergedOptions.slideHeight;
        }
      }
      return true;
    }
    
    function setAutoPlay() {
      if (mergedOptions.autoPlay) {
        timer = setTimeout(autoPlay, mergedOptions.transitonInterval);
      }
    }
    
    function addSliderItems() {
      var dataSource = mergedOptions.dataSource;
      if (dataSource && $.isArray(dataSource)) {
        var items = [];
        $.each(dataSource, function(index, item){
          items.push(getSliderItemString(item));
        });
        slideContainer.append(items.join(''));
      }
    }
    
    function getSliderItemString(itemData) {
      var itemDom = $("#slider-item-template").clone().find("li");
      itemDom.css('background-image', 'url(' + itemData.img + ')');
      itemDom.find("a").attr('data-href', itemData.link);
      itemDom.find('h2').text(itemData.title);
      return itemDom.prop('outerHTML');
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
      if (mergedOptions.slideMode === "horizontal") {
        setTranslateXValue();
      } else {
        setTranslateYValue();
      }
    }
    
    function autoPlay() {
      if (mergedOptions.autoPlay) {
        if (autoPlayFinished) {
          window.clearTimeout(timer);
          return false;
        }
        if (slidePageIndex === slideDisplayCount -1 ) {
          if (!mergedOptions.loop) {
            autoPlayFinished = true;
            window.clearTimeout(timer);
            return false;
          }
          disableTransitionDuration();
          slidePageIndex = 1;
          setTranslateXValue();
 
          setTimeout(function(){
            enableTransitionDuration();
            next();
          }, 0);
        } else if (slidePageIndex === 0) {
          disableTransitionDuration();
          if (mergedOptions.loop) {
            slidePageIndex = slideDisplayCount - 2;
            setTranslateXValue();
          }
          setTimeout(function(){
            enableTransitionDuration();
            next();
          }, 0);
        } else {
          next();
        }
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
        value = slidePageWidth * slidePageIndex;
        currentTranslateXValue = - value;
        value = currentTranslateXValue + "px";
      }
      
      setSlideContainerTransform(value, 0);
    }
    function setTranslateYValue(value) {
      if (!value) {
        value = slidePageHeight * slidePageIndex;
        currentTranslateYValue = - value;
        value = currentTranslateYValue + "px";
      }
      setSlideContainerTransform(0, value);
    }

    function setSlideContainerTransform(x, y) {
      var translateValue = translateValuePrefix + x + ", " + y + translateValuePostfix;
      slideContainer.css({ "-webkit-transform": translateValue, "-moz-transform": translateValue, "-o-transform": translateValue, "transform": translateValue, });
    }

    function transitionEndEventHandler() {
      updateIndicatorStatus();
      setAutoPlay();
      return false;
    }

    function bindEvents() {
      new TouchObject(element[0]);
      $(window).on("resize", handleOrientationChange);
      slideContainer.on(transitionEndEventName, transitionEndEventHandler);
      $(element).on("tap", tapHandler);
      // If the slides are less than two, we don't add swipe event handlers.
      if (slideCount > 2) {
        $(element).on("swipe", enableTransitionDuration);
        $(element).on("swipeUp", swipeUpHandler);
        $(element).on("swipeDown", swipeDownHandler);
        $(element).on("swipeLeft", swipeLeftHandler);
        $(element).on("swipeRight", swipeRightHandler);
        $(element).on("swipeStart", swipeStartHandler);
        $(element).on("swipeCancel", swipeCancelMyHandler);
        $(element).on("swipeProgress", swipeProgressHandler);
      }
      setTimeout(function(){
        setTransitionDuration();
        setAutoPlay();
      }, 0);
    }

    function swipeUpHandler(){
      if (mergedOptions.slideMode === "horizontal") {
        swipeCancelMyHandler();
      } else {
        swipeNextHandler();
      }
    }
    function swipeDownHandler(){
      if (mergedOptions.slideMode === "horizontal") {
        swipeCancelMyHandler();
      } else {
        swipePreviousHandler();
      }
    }
    function swipeLeftHandler(){
      if (mergedOptions.slideMode === "horizontal") {
        swipeNextHandler();
      } else {
        swipeCancelMyHandler();
      }
    }
    function swipeRightHandler(){
      if (mergedOptions.slideMode === "horizontal") {
        swipePreviousHandler();
      } else {
        swipeCancelMyHandler();
      }
    }

    function swipePreviousHandler() {
      if (!mergedOptions.loop && slidePageIndex === 0) {
        swipeCancelMyHandler();
      } else {
        prev();
      }
    }

    function swipeNextHandler() {
      if (!mergedOptions.loop && slidePageIndex === slideDisplayCount - 1) {
        swipeCancelMyHandler();
      } else {
        next();
      }
    }

    function tapHandler(e){
      if (e.detail && e.detail.target){
        window.location = $(e.detail.target).attr('data-href');
      }
      return false;
    }

    function swipeStartHandler(e) {
      window.clearTimeout(timer);
      if (mergedOptions.slideMode === "horizontal") {
        var nowTranslateXValue = getTranslateXValue(slideContainer[0]);
        currentTranslateXValue = nowTranslateXValue;
      } else {
        var nowTranslateYValue = getTranslateYValue(slideContainer[0]);
        currentTranslateYValue = nowTranslateYValue;
      }

      disableTransitionDuration();
      if (mergedOptions.slideMode === "horizontal") {
        setTranslateXValue(nowTranslateXValue+'px');
      } else {
        setTranslateYValue(nowTranslateYValue+'px');
      }
      if (!mergedOptions.loop) return false;
      if (slidePageIndex === slideDisplayCount -1 ) {
        slidePageIndex = 1;
        if (mergedOptions.slideMode === "horizontal") {
          var value = - mergedOptions.slideWidth * 2 + (slideContainer.width() + nowTranslateXValue);
          currentTranslateXValue = value;
          setTranslateXValue(value+ "px");
        } else {
          var value = - mergedOptions.slideHeight * 2 + (slideContainer.height() + nowTranslateYValue);
          currentTranslateYValue = value;
          setTranslateYValue(value+ "px");
        }
      } else if (slidePageIndex === 0) {
        slidePageIndex = slideDisplayCount - 2;
        if (mergedOptions.slideMode === "horizontal") {
          var value = - mergedOptions.slideWidth * slidePageIndex + nowTranslateXValue;
          currentTranslateXValue = value;
          setTranslateXValue(value + "px");
        } else {
          var value = - mergedOptions.slideHeight * slidePageIndex + nowTranslateYValue;
          currentTranslateYValue = value;
          setTranslateYValue(value + "px");
        }
      } else {
        
      }
    }

    function swipeProgressHandler(e) {
      var movedX = e.detail.detail.movedPageX,
          movedY = e.detail.detail.movedPageY;
      if (mergedOptions.slideMode === "horizontal") {
        setTranslateXValue((currentTranslateXValue + movedX) + "px");
      } else {
        setTranslateYValue((currentTranslateYValue + movedY) + "px");
      }
    }
    
    function swipeCancelMyHandler() {
      enableTransitionDuration();
      if (mergedOptions.slideMode === "horizontal") {
        setTranslateXValue();
      } else {
        setTranslateYValue();
      }
    }
    
    function handleOrientationChange() {
      window.clearTimeout(timer);
      disableTransitionDuration();
      setTimeout(function(){
        element.css('height', '');
        setSlideRootHeight();
        if (mergedOptions.slideMode === "horizontal") {
          slidePageWidth = slideContainer.children().eq(0).width();
          setTranslateXValue(); 
        } else {
          slidePageHeight = slideContainer.children().eq(0).height();
          setTranslateYValue(); 
        }
        updateIndicatorStatus();
        // Resume transition after the orientation change event.
        setTimeout(function(){
          enableTransitionDuration();
          setAutoPlay();
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
    
    function disableTransitionDuration() {
      slideContainer.addClass("duration-initial");
    }
    
    function enableTransitionDuration() {
      slideContainer.removeClass("duration-initial");
    }
    
    function addIndicator() {
      var domStr = "<strong class='" + mergedOptions.indicatorClass +"'>";
      for (var i = 0; i < slideCount; i++) {
        domStr += "<span></span>";
      }
      domStr += "</strong>";
      element.append(domStr);
      indicators = element.find('.' + mergedOptions.indicatorClass).children();
      indicators.eq(0).addClass(mergedOptions.indicatorActiveItemClass);
    }
    
    function updateIndicatorStatus() {
      indicators.removeClass(mergedOptions.indicatorActiveItemClass);
      indicators.eq(pageIndex).addClass(mergedOptions.indicatorActiveItemClass);
    }
    
    function getSlideRootHeight(aspectRatio) {
      if (aspectRatio === "fullscreen") {
        return element.height() || window.innerHeight;
      }
      return element.width() / aspectRatio;
    }
    
    function setSlideRootHeight() {
      element.height(getSlideRootHeight(mergedOptions.aspectRatio));
    }
  
    Object.defineProperty(this, "dispose", {
      value: function() {
        $(window).off("resize", handleOrientationChange);
        slideContainer.off(transitionEndEventName, transitionEndEventHandler);
        $(element).off("tap", tapHandler);
        $(element).off("swipe", enableTransitionDuration);
        $(element).off("swipeUp", swipeUpHandler);
        $(element).off("swipeDown", swipeDownHandler);
        $(element).off("swipeLeft", swipeLeftHandler);
        $(element).off("swipeRight", swipeRightHandler);
        $(element).off("swipeStart", swipeStartHandler);
        $(element).off("swipeCancel", swipeCancelMyHandler);
        $(element).off("swipeProgress", swipeProgressHandler);
      }
    });
  }
  
  /**
   * Get the transitionend event name.
   * Works: IE 10+, Firefox 4+, Chrome 4+, iOS, Android
   */
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
  
  function has3d(){
      var el = document.createElement('p'),
      has3d,
      transforms = {
          'webkitTransform':'-webkit-transform',
          'OTransform':'-o-transform',
          'msTransform':'-ms-transform',
          'MozTransform':'-moz-transform',
          'transform':'transform'
      };
   
      // Add it to the body to get the computed style
      document.body.insertBefore(el, null);
   
      for(var t in transforms){
          if( el.style[t] !== undefined ){
              el.style[t] = 'translate3d(1px,1px,1px)';
              has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
          }
      }
   
      document.body.removeChild(el);
   
      return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }
  
  function getTranslateXValue(domElement) {
    var val = getTranslateValue(domElement);
    return val.m41;
  }

  function getTranslateYValue(domElement) {
    var val = getTranslateValue(domElement);
    return val.m42;
  }

  /**
   * Return the CSS3 translate value of a DOM element. 
   * Note: IE 9+
   * @param {Object} domElement : A native DOM element
   * @returns {mixed}
   */
  function getTranslateValue(domElement) {
    var cssMatrixObject = null;
    if (typeof WebKitCSSMatrix !== "undefined") {
      cssMatrixObject = WebKitCSSMatrix;
    } else if (typeof MSCSSMatrix !== "undefined") {
      cssMatrixObject = MSCSSMatrix;
    } else if (typeof DOMMatrix !== "undefined") {
      cssMatrixObject = DOMMatrix;
    }

    var style = window.getComputedStyle(domElement);

    var matrixString = '';
    if (typeof style.webkitTransform !== "undefined") {
      matrixString = style.webkitTransform;
    } else if (typeof style.mozTransform !== "undefined") {
      matrixString = style.mozTransform;
    } else if (typeof style.msTransform !== "undefined") {
      matrixString = style.msTransform;
    } else if (typeof style.transform !== "undefined") {
      matrixString = style.transform;
    }

    return new cssMatrixObject(matrixString);
  }
  
  $.fn.css3Rotator = function (options) {
    // Using the each() method to loop through the elements
    return this.each(function(index, item){
      var rotatorObj = new Css3Rotator($(item), options);
    });
  };
});
