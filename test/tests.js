$(function(){
  var obj = new Css3Rotator("#gallery", {
    container: '.list',
    autoPlay: false,
    dataSource: [
      {
        title: 'The first photo',
        img: '../demo/images/abf6afa0bb6de81d7abb16923b3_p1_mk1.jpg',
        link: 'http://m.leju.com/touch/news/c/bj/5984223020636746567.html'
      },
      {
        title: '不愁房租涨首付两万五买房靠谱',
        img: '../demo/images/d41c8d152cc8554132424b96cd5_p1_mk1.jpg',
        link: 'http://m.leju.com/touch/news/c/bj/5986396554918146726.html'
      }
    ]
  });

  /* Constructor */
  QUnit.module("Constructors Test");
  QUnit.test( "Constructor test", function( assert ) {
    assert.ok(typeof obj !== "undefined", "The obj variable is defined.");
  });


  /* Events */
  QUnit.module("Events Tests");
  QUnit.test("onpageselected and onpagecompleted test", function(assert) {
    assert.expect(2);
    alert("Please swipe left and make sure the second was changed as the active one");
    var done = assert.async(2);
    obj.addEventListener("pageselected", fn1);
    function fn1(event, currentIndex) {
      assert.strictEqual(currentIndex, 2, "The slide changed to the second one");
      done();
      obj.removeEventListener("pageselected", fn1);
    }

    obj.addEventListener("pagecompleted", fn2);
    function fn2(event, currentIndex) {
      assert.strictEqual(currentIndex, 2, "The page transition finished.");
      done();
      obj.removeEventListener("pagecompleted", fn2);
    }

  });

  /* Properties */
  QUnit.module("Properties Test");
  QUnit.test("The element property", function(assert) {
    assert.equal(obj.element.attr("id"), "gallery", "The id of root element is #gallery");
    obj.element = $("body");
    assert.equal(obj.element.attr("id"), "gallery", "The root element is still #gallery");
  });
  QUnit.test("currentPage test", function(assert) {
    assert.strictEqual(obj.currentPage, 2, "The second page is the active one.");
    // TODO 
    var done = assert.async();
    setTimeout(function(){
      obj.currentPage = 1;
      assert.strictEqual(obj.currentPage, 1, "The active page is changed to the first one."); 
      done();
    }, 3000);
  });


  /* Methods */
  QUnit.module("Methods Tests");
  QUnit.test("AddEventListener Test", function(assert) {
    assert.ok(typeof obj.addEventListener === "function", "The addEventListener method is defined.");
  });
  QUnit.test("removeEventListener Test", function(assert) {
    assert.ok(typeof obj.removeEventListener === "function", "The removeEventListener method is defined.");
  });
  QUnit.test("dispatchEvent Test", function(assert) {
    assert.ok(typeof obj.dispatchEvent === "function", "The dispatchEvent method is defined.");
  });
  QUnit.test("AddEventListener Test", function(assert) {
    assert.ok(typeof obj.addEventListener === "function", "The addEventListener method is defined.");
  });
  QUnit.test("Count Test", function(assert) {
    assert.ok(typeof obj.count === "function", "The count method is defined"); 
    assert.strictEqual(obj.count(), 2, "There are 2 pages in the slideshow.");
  });
  QUnit.test("previous Test", function(assert) {
    assert.ok(typeof obj.previous === "function", "The previous method is defined"); 
    //obj.previous();
    //assert.strictEqual(obj.currentPage, 1, "The first element is active now.");
  });
  QUnit.test("Dispose the obj object", function(assert) {
    assert.ok(obj.dispose, "Css3Rotator.dispose is defined");
    obj.dispose();
    //alert("Please run getEventListeners(document.querySelector('#gallery')) in your console and make sure all handlers were removed.");
  });
  
});
