/* global Zepto */

﻿(function(factory){
  var $ = (typeof Zepto !== "undefined") ? Zepto : jQuery;
  factory($);
})(function ($) {
  function Css3Rotator(element, options) {
    var defaults = {
      container: '.rotatorWrapper',
      transitionDuration: '5s',
      slideWidth: element.width(), /* TODO  */
      transitonInterval: '2000',
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
      addSliderItems();
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
        setAutoPlay();
        //autoPlay();
      }, 0);
    }
    
    function setAutoPlay() {
      if (mergedOptions.autoPlay) {
        //setTransitionDelay();
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
      setTranslateXValue();
    }
    
    function autoPlay() {
      if (mergedOptions.autoPlay) {
        if (slidePageIndex === slideDisplayCount -1 ) {
          disableTransitionDuration();
          slidePageIndex = 1;
          setTranslateXValue();
 
          setTimeout(function(){
            enableTransitionDuration();
            next();
          }, 0);
        } else if (slidePageIndex === 0) {
          disableTransitionDuration();
          slidePageIndex = slideDisplayCount - 2;
          setTranslateXValue();
          
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
      //autoPlay();
      setAutoPlay();
      return false;
    }

    function bindEvents() {
      slideContainer.on(transitionEndEventName, transitionEndEventHandler);
      var count = 0;
      $(window).on("orientationchange", handleOrientationChange);
      $(element).on("click", "a[data-href]", function(){
        window.location = $(this).attr('data-href');
        return false;
      });
      
      $(element).on("swipeMy", function(e) {
        enableTransitionDuration();
        //setAutoPlay();
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
        window.clearTimeout(timer);
        var nowTranslateXValue = getTranslateXValue(slideContainer[0]);
        currentTranslateXValue = nowTranslateXValue;
        disableTransitionDuration();
        setTranslateXValue(nowTranslateXValue+'px');
        console.log('x:'+nowTranslateXValue);
        if (slidePageIndex === slideDisplayCount -1 ) {
          slidePageIndex = 1;
          setTranslateXValue();
        } else if (slidePageIndex === 0) {
          slidePageIndex = slideDisplayCount - 2;
          setTranslateXValue();
        } else {
          
        }
      });
      $(element).on("swipeCancelMy", function(){
        enableTransitionDuration();
        //setAutoPlay();
        setTranslateXValue();
      });
      
      $(element).on("swipeProgressMy", function(e, e1, e2) {
        count++;
        setTranslateXValue((currentTranslateXValue + e1) + "px");
        //console.log("progrsss:", (currentTranslateXValue + e1) + "px");
        $("#debug").text("count:" + count + " progrsss:" + (currentTranslateXValue + e1) + "px");
      });
      
    }
    
    function handleOrientationChange() {
      //slideContainer.addClass("notransition");// Disable transition
      disableTransitionDuration();
      setTimeout(function(){
        setTranslateXValue(); 
        updateIndicatorStatus();
        // Resume transition after the orientation change event.
        setTimeout(function(){
          //slideContainer.removeClass("notransition"); // Enable transition
          //autoPlay();
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
  
  
  /**
   * Return the CSS3 translatex value of a DOM element.
   * @param {Object} domElement : A native DOM element
   * @returns {mixed}
   */
  function getTranslateXValue(domElement) {
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
    } else if (typeof style.transform !== "undefined") {
      matrixString = style.transform;
    }

    var matrix = new cssMatrixObject(matrixString);
    return matrix.m41;
  }
  
  $.fn.css3Rotator = function (options) {
    // Using the each() method to loop through the elements
    return this.each(function(index, item){
      var rotatorObj = new Css3Rotator($(item), options);
    });
  };
});