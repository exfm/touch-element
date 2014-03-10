(function ($){

"use strict";

$.fn.touchElement = function(options) {
    var opts = $.extend( {}, $.fn.touchElement.defaults, options);
    return this.each(function() {
        new TouchElement(this, opts);
    });
};

$.fn.touchElement.defaults = {
    'isTouchDevice': 'ontouchstart' in document.documentElement,
    'touched': function() {},
    'removeTapHighlight': true,
    'removeTouchCallout': true,
    'removeUserSelect': true,
    'xRange': 70,
    'yRange': 70,
    'touchStartClass': 'touchstart',
    'touchClassElement': null,
    'shouldPreventDefault': false,
    'shouldStopPropagation': false,
    'triggerTimeoutDelay': 300
};

function TouchElement(el, opts){
    this.el = $(el);
    this.opts = opts;
    this.removeListeners();
    this.addListeners();

    // boolean if the element has touchStart class
    this.hasTouchStartClass = false;

    // keep track of the element's dimensions
    this.elDimensions = {};

    this.touchClassElement = $(this.el);
    if(this.opts.touchClassElement !== null){
        this.touchClassElement = $(this.opts.touchClassElement);
    }
    this.addStyleOptions();
    
    this.justTriggered = false;

    return this;
}

// add touch listeners to the element
// if it is not a touch device, add 'click' listener
TouchElement.prototype.addListeners = function(){
    if(this.opts.isTouchDevice){
        this.bindedTouchStartListener = $.proxy(this.touchStartListener, this);
        this.bindedTouchEndListener = $.proxy(this.touchEndListener, this);
        this.bindedTouchMoveListener = $.proxy(this.touchMoveListener, this);
        this.el.on('touchstart', this.bindedTouchStartListener);
        this.el.on('touchend', this.bindedTouchEndListener);
        this.el.on('touchmove', this.bindedTouchMoveListener);
    }
    else{
        this.bindedClickListener = $.proxy(this.trigger, this);
        this.el.on('click', this.bindedClickListener);
    }
}

// remove touch and click listeners to the element
// if it is not a touch device, add 'click' listener
TouchElement.prototype.removeListeners = function(){
    this.el.off('touchstart', this.bindedTouchStartListener);
    this.el.off('touchend', this.bindedTouchEndListener);
    this.el.off('touchmove', this.bindedTouchMoveListener);
    this.el.off('click', this.bindedClickListener);
}

// Add styles based on instance options
TouchElement.prototype.addStyleOptions = function(){
    if(this.opts.removeTapHighlight === true){
        this.el.css('webkitTapHighlightColor', 'rgba(0,0,0,0)');
    };
    if(this.opts.removeTouchCallout === true){
        this.el.css('webkitTouchCallout', 'none');
    };
    if(this.opts.removeUserSelect === true) {
        this.el.css('webkitUserSelect', 'none');
    };
}

// add touchStartClass to element.
// remove touchEndClass
TouchElement.prototype.addTouchStartClass = function(e){
    if(this.hasTouchStartClass === false){
        if(this.opts.touchEndClass){
            this.touchClassElement.removeClass(this.opts.touchEndClass);
        }
        this.touchClassElement.addClass(this.opts.touchStartClass);
        this.hasTouchStartClass = true;
    }
}

// add touchEndClass to element
// remove touchStartClass
TouchElement.prototype.removeTouchStartClass = function(e){
    if (this.hasTouchStartClass === true){
        this.touchClassElement.removeClass(this.opts.touchStartClass);
        if(this.opts.touchEndClass){
            this.touchClassElement.addClass(this.opts.touchEndClass);
        }
        this.hasTouchStartClass = false;
    }
}

// listen for 'touchstart' event.
// addTouchStartClass
// get the position and dimensions of the element
TouchElement.prototype.touchStartListener = function(e){
    if(this.opts.shouldPreventDefault === true){
        e.preventDefault();
    };
    this.shouldTrigger = true;
    this.addTouchStartClass(e);
    var position = webkitConvertPointFromNodeToPage(e.target, new WebKitPoint(0, 0));
    this.elDimensions.startX = position.x;
    this.elDimensions.endX = position.x + e.target.offsetWidth;
    this.elDimensions.startY = position.y;
    this.elDimensions.endY = position.y + e.target.offsetHeight;
    if(this.opts.shouldStopPropagation === true){
        e.stopPropagation();
        return false;
    };
}


// listen for 'touchend' event.
// removeTouchStartClass
// trigger a 'touched' event on the element
TouchElement.prototype.touchEndListener = function(e){
    this.removeTouchStartClass(e);
    if(this.opts.shouldPreventDefault === true){
        e.preventDefault();
    };
    if(this.shouldTrigger === true){
        this.trigger(e);
    }
    if(this.opts.shouldStopPropagation === true){
        e.stopPropagation();
        return false;
    };
}

// listen for 'touchmove' event. If we are within bounds
// set by xRange and yRange, add touchStart class. If not,
// remove touchStart class.
TouchElement.prototype.touchMoveListener = function(e){
    if(!this.testBounds(e.targetTouches[0])){
        this.shouldTrigger = false;
        this.removeTouchStartClass(e);
    }
    else {
        this.shouldTrigger = true;
        this.addTouchStartClass(e);
    };
}

// test that the touch is within the bounds of xRange and yRange
TouchElement.prototype.testBounds = function(target){
    if(target.pageX < this.elDimensions.startX - this.opts.xRange){
        return false;
    }
    if(target.pageX > this.elDimensions.endX + this.opts.xRange){
        return false;
    }
    if(target.pageX < 5){
        return false;
    }
    if(target.pageY < this.elDimensions.startY - this.opts.yRange){
        return false;
    }
    if(target.pageY > this.elDimensions.endY + this.opts.yRange){
        return false;
    }
    if(target.pageY < 0){
        return false;
    }
    return true;
}

// trigger our custom 'touched' event
TouchElement.prototype.trigger = function(e){
    if(this.justTriggered === false){
        this.opts.touched.call(this, e);
        this.el.trigger($.extend($.Event('touched'), e));
        this.justTriggered = true;
        this.triggerTimeout = setTimeout(
            function(){
                this.justTriggered = false;
            }.bind(this),
            this.opts.triggerTimeoutDelay
        );
    }
}


}($)); // end


