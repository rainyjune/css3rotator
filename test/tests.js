$(function(){
  QUnit.module("Load test");
  QUnit.test( "Object test", function( assert ) {
    assert.expect(2);
    var obj = $("#gallery").css3Rotator({
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

    assert.ok(typeof obj !== "undefined", "The obj variable is defined.");
    alert("Please swipe left and make sure the second was changed as the active one");
    var done = assert.async();
    obj.on("slidechanged", function(event, currentIndex){
      assert.strictEqual(currentIndex, 2, "The slide changed to the second one");
      done();
      obj.off("slidechanged");
    });

  });

  QUnit.test("The next test", function(assert) {
    assert.ok(true, "Always true");
  });
  
});
