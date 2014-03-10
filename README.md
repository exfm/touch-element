# touch-element

This gives a more native feel to touching an element. Uses 'touchstart' event
which is a lot faster than 'click'. Like native apps, you can touch an element, 
then drag your finger off the element and it will not register as a click. If you
drag your finger back on, it will register. For non-touch devices, it will fire the
'touched' event when it detects a click. 


## Install


     npm install touch-element

## Testing

    git clone 
    npm install
    open test/index.html
    
## Usage
    
    var TouchElement = require('TouchElement'),
    $('#el').touchElement().on('touched', this.onElTouch);
