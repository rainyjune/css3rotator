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

  QUnit.module("Load test");
  QUnit.test( "Object test", function( assert ) {
    assert.expect(2);

    assert.ok(typeof obj !== "undefined", "The obj variable is defined.");
    alert("Please swipe left and make sure the second was changed as the active one");
    var done = assert.async();
    obj.addEventListener("slidechanged", slidechangeHandler);

    function slidechangeHandler(event, currentIndex) {
      assert.strictEqual(currentIndex, 2, "The slide changed to the second one");
      done();
      obj.removeEventListener("slidechanged", slidechangeHandler);
    }

  });

  QUnit.module("Properties Test");
  QUnit.test("The element property", function(assert) {
    assert.equal(obj.element.attr("id"), "gallery", "The id of root element is #gallery");
    obj.element = $("body");
    assert.equal(obj.element.attr("id"), "gallery", "The root element is still #gallery");
  });

  QUnit.module("Dispose test");

  QUnit.test("Dispose the obj object", function(assert) {
    assert.ok(true, "Always true");
  });
  
});
