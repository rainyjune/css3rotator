define(['qunit', 'slider'], function(QUnit, Slider) {
  return function(){
    QUnit.module("AMD autostart");
    QUnit.test("Prove the test run started as expected", function(assert) {
      assert.strictEqual(beginData.totalTests, 2, "Should have expected 2 test"); 
    });
    QUnit.test("The slider is registered as an AMD module", function(assert) {
      assert.ok(Slider, "The Slider variable is defined.");
      assert.ok(typeof Slider === "function", "The type of Slider is function.");
      debugger;
    });
  };
});
