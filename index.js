(function(){
    
"use strict";

// constructor
function TouchElement(el, opts){
    
    // Is this a touch device? Or just mouse clicks?
    this.isTouchDevice = 'ontouchstart' in document.documentElement;
    
    // the element we are attaching to. Required.
    if(el){
        this.el = el;
        this.addListeners();
    }
    else{
        throw new TypeError("You must provide an element");
    }
    
    // should we add rgba(0,0,0,0) to webkitTapHighlightColor style on 
    // element to remove the tap highlight?
    this.removeTapHighlight = true;
    
    // should we add 'none' to webkitTouchCallout style on element
    // to remove touchCallout?
    this.removeTouchCallout = true;
    
    // should we add 'none' to webkitUserSelect style on element
    // to remove userSelect?
    this.removeUserSelect = true;
    
    // horizontal target area around element 
    this.xRange = opts && opts.xRange || 70;
   
    // vertical target area around element
    this.yRange = opts && opts.yRange || 70;
    
    // extend all options passed in to this
    $.extend(this, opts);
    
    // boolean if the element has touchStart class 
    this.hasTouchStartClass = false;
   
    // keep track of the element's dimensions
    this.elDimensions = {};
    
    this.addStyleOptions();
    
}

// add touch listeners to the element
// if it is not a touch device, add 'click' listener
TouchElement.prototype.addListeners = function(){
    if(TouchElement.isTouchDevice){
        this.el.addEventListener(
            'touchstart', 
            this.touchStartListener.bind(this), 
            true
        );
        this.el.addEventListener(
            'touchend', 
            this.touchEndListener.bind(this), 
            true
        );
        this.el.addEventListener(
            'touchmove', 
            this.touchMoveListener.bind(this), 
            true
        );
    }
    else{
        this.el.addEventListener(
            'click', 
            this.clickListener.bind(this), 
            false
        );
    }
}

// Add styles based on instance options
TouchElement.prototype.addStyleOptions = function(){
    if(this.removeTapHighlight){
        this.el.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
    };
    if(this.removeTouchCallout){
        this.el.style.webkitTouchCallout = "none";
    };
    if (this.removeUserSelect) {
        this.el.style.webkitUserSelect = "none";
    };
}

// add touchStartClass to element. 
// remove touchEndClass
TouchElement.prototype.addTouchStartClass = function(e){
    if (this.hasTouchStartClass == false){
        if(this.touchEndClass){
            $(this.el).removeClass(this.touchEndClass);
        }
        $(this.el).addClass(this.touchStartClass);
        this.hasTouchStartClass = true;
    }
}

// add touchEndClass to element
// remove touchStartClass
TouchElement.prototype.removeTouchStartClass = function(e){
    if (this.hasTouchStartClass == true){
        $(this.el).removeClass(this.touchStartClass);
        if(this.touchEndClass){
            $(this.el).addClass(this.touchEndClass)
        }
        this.hasTouchStartClass = false;
    }
}

// listen for 'touchstart' event.
// addTouchStartClass
// get the position and dimensions of the element
TouchElement.prototype.touchStartListener = function(e){
    e.preventDefault();
    this.addTouchStartClass(e);
    var position = webkitConvertPointFromNodeToPage(e.target, new WebKitPoint(0, 0));
    this.elDimensions.startX = position.x;
    this.elDimensions.endX = position.x + e.target.offsetWidth;
    this.elDimensions.startY = position.y;
    this.elDimensions.endY = position.y + e.target.offsetHeight;
}

// listen for 'touchend' event.
// removeTouchStartClass
// trigger a 'touched' event on the element
TouchElement.prototype.touchEndListener = function(e){
    if($(this.el).hasClass(this.touchStartClass)){
        $(this.el).trigger(
            {
                'type': 'touched'
            }
        );
    }
    this.removeTouchStartClass(e);
}

// for non-touch devices. Trigger a 'touched' event on click.
TouchElement.prototype.clickListener = function(e){
    $(this.el).trigger(
        {
            'type': 'touched'
        }
    );
}

// listen for 'touchmove' event. If we are within bounds
// set by xRange and yRange, add touchStart class. If not,
// remove touchStart class.
TouchElement.prototype.touchMoveListener = function(e){
    e.preventDefault();
    if(!this.testBounds(e.targetTouches[0])){
        this.removeTouchStartClass(e);
    } 
    else {
        this.addTouchStartClass(e);
    };
}

// test that the touch is within the bounds of xRange and yRange
TouchElement.prototype.testBounds = function(target){
    if(target.pageX < this.elDimensions.startX - this.xRange){
        return false;
    }
    if(target.pageX > this.elDimensions.endX + this.xRange){
        return false;
    }
    if(target.pageX < 5){
        return false;
    }
    if(target.pageY < this.elDimensions.startY - this.yRange){
        return false;
    }
    if(target.pageY > this.elDimensions.endY + this.yRange){
        return false;
    }
    if(target.pageY < 0){
        return false;
    }
    return true;
}


// check if we've got require
if(typeof module !== "undefined"){
    module.exports = TouchElement;
}
else{
    window.TouchElement = TouchElement;
}

}()); // end wrapper