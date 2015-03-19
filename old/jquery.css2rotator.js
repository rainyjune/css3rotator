; (function ($) {
  $.fn.css2Rotator = function (options) {
    var element = $(this);

    var defaultOptions = {
      prevBtn: '.prev',
      nextBtn: '.next',
      container: '.container',
      autoPlay: true,
      pauseAfterSlide: true,
      pauseDuration: 2000,
      slideWidth: 800,
      slideDuration: 1000
    };

    var mergedOptions = $.extend(defaultOptions, options);

    var container,
      slideCount,
      prevBtn,
      nextBtn,
      slideIndex,
      timer,
      isRunning;


    function init() {
      container = element.find(mergedOptions.container);
      prevBtn = element.find(mergedOptions.prevBtn);
      nextBtn = element.find(mergedOptions.nextBtn);

      element.addClass("css2rotator");
      container.addClass("container");
      element.css("width", mergedOptions.slideWidth);
      container.children().css("width", mergedOptions.slideWidth);

      slideIndex = 0;

      slideCount = container.children().length;
      container.width(slideCount * mergedOptions.slideWidth);
      bindEvents();

      if (mergedOptions.autoPlay) {
        isRunning = true;
        setIntervalTask();
      }
    }

    function setIntervalTask() {
      var interval = mergedOptions.pauseAfterSlide ?
          mergedOptions.pauseDuration + mergedOptions.slideDuration :
          mergedOptions.slideDuration;
      next();
      doAnimation();
      if (isRunning) {
        timer = setTimeout(setIntervalTask, interval);
      }
    }
    function stopIntervalTask() {
      isRunning = false;
      clearTimeout(timer);
    }
    
    function next(e) {
      
      if (slideIndex >= 0 && slideIndex < slideCount - 1) {
        slideIndex++;
      } else {
        slideIndex = 0;
      }
      //doAnimation();
    }

    function prev(e) {
      
      if (slideIndex > 0) {
        slideIndex--;
      } else {
        slideIndex = slideCount - 1;
      }
      //doAnimation();
    }

    function doAnimation(completeCallback) {
      completeCallback = completeCallback || function () { };
      var moveWidth = mergedOptions.slideWidth * slideIndex;
      moveWidth = -moveWidth;
      container.animate({
        left: moveWidth + "px"
      }, mergedOptions.slideDuration, completeCallback);
    }

    function bindEvents() {
      prevBtn.on("click", prevBtnPressed);
      nextBtn.on("click", nextBtnPressed);
      container.on("mouseover", containerMouseOver);
      container.on("mouseout", containerMouseOut);
    }

    function prevBtnPressed(e) {
      if (e) {
        e.preventDefault();
      }
      if (mergedOptions.autoPlay) {
        stopIntervalTask();
      }
      prev();
      doAnimation(function () {
        if (mergedOptions.autoPlay) { 
          setTimeout(function () { isRunning = true; setIntervalTask(); }, mergedOptions.pauseDuration);
        }
      });
    }

    function nextBtnPressed(e) {
      if (e) {
        e.preventDefault();
      }
      if (mergedOptions.autoPlay) {
        stopIntervalTask();
      }
      next();
      doAnimation(function () {
        if (mergedOptions.autoPlay) {  
          setTimeout(function () { isRunning = true; setIntervalTask(); }, mergedOptions.pauseDuration);
        }
      });
    }

    function containerMouseOver() {
      if (mergedOptions.autoPlay) {
        stopIntervalTask();
      }
    }

    function containerMouseOut() {
      if (mergedOptions.autoPlay) {
        isRunning = true;
        setIntervalTask();
      }
    }

    function updateButtons() {

    }

    init();

    return element;
  };
})(jQuery);