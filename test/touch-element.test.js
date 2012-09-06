"use strict";

function createNewTouchElement(opts){
    var el = document.createElement('div');
    var te = new TouchElement(el, opts);
    return te;
}

describe("touch-element", function(){
    it("should throw an error if an element isn't provided", function(){
        assert.throw(
            function(){
                new TouchElement()
            }, /You must provide an element/
        );
    });
    it("should trigger a 'touched' event when the element is touched");
    it("should trigger a 'touched' event when the element is clicked on", function(done){
        var te = createNewTouchElement();
        $(te.el).bind('touched', function(e){
            assert.equal(e.type, 'touched');
            done();
        });
        $(te.el).trigger('click');
    });
    it("should add the touchStartClass", function(){
        var te = createNewTouchElement();
        te.addTouchStartClass();
        assert.equal($(te.el).hasClass('touchstart'), true);
    });
    it("should add a custom touchStartClass", function(){
        var te = createNewTouchElement(
            {
                'touchStartClass': 'customTouchStartClass'
            }
        );
        te.addTouchStartClass();
        assert.equal($(te.el).hasClass('customTouchStartClass'), true);
    });
    it("should add the touchEndClass if passed in as an option", function(){
        var te = createNewTouchElement(
            {
                'touchEndClass': 'customTouchEndClass'
            }
        );
        te.addTouchStartClass();
        te.removeTouchStartClass();
        assert.equal($(te.el).hasClass('customTouchEndClass'), true);
    });
    it("should disable webkitTapHighlightColor", function(){
        var te = createNewTouchElement();
        assert.equal($(te.el).css('webkitTapHighlightColor'), 'rgba(0, 0, 0, 0)');
    });
    it("should disable webkitTouchCallout", function(){
        var te = createNewTouchElement();
        assert.equal(te.el.style.webkitTouchCallout, 'none');
    });
    it("should disable webkitUserSelect", function(){
        var te = createNewTouchElement();
        assert.equal($(te.el).css('webkitUserSelect'), 'none');
    });
});