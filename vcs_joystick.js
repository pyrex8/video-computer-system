
var gp = null;
var game_pad_exists = 0;

var keyboard_fire = 0;
var keyboard_up = 0;
var keyboard_down = 0;
var keyboard_left = 0;
var keyboard_right = 0;



window.addEventListener("gamepadconnected", function(e) {
  gp = navigator.getGamepads()[e.gamepad.index];
  
  game_pad_exists = 1;
});


document.addEventListener('keydown', keyDownHandler, false);

document.addEventListener('keyup', keyUpHandler, false);





function Joystick()  {
}


Joystick.prototype.up = function() {
    if (game_pad_exists) {
        if (gp.axes[1] < 0) {
            return true;
        }      
    }
    if (keyboard_up) {
        return true;
    }
    return false;
}

Joystick.prototype.down = function() {
    if (game_pad_exists) {
        if (gp.axes[1] > 0) {
            return true;
        }      
    }
    if (keyboard_down) {
        return true;
    }    
    return false;
}

Joystick.prototype.left = function() {
    if (game_pad_exists) {
        if (gp.axes[0] < 0) {
            return true;
        }      
    }
    if (keyboard_left) {
        return true;
    }  
    return false;
}

Joystick.prototype.right = function() {
    if (game_pad_exists) {
        if (gp.axes[0] > 0) {
            return true;
        }      
    }
    if (keyboard_right) {
        return true;
    }  
    return false;
}


Joystick.prototype.fire = function() {
    if (game_pad_exists) {
        if (gp.buttons[0].pressed) {
            return true;
        }      
    }
    if (keyboard_fire) {
        return true;
    }  
    return false;
}



function keyDownHandler(event) {
    var key = event.which || event.keyCode;
    if (key === 38) {
        //up arrow
        keyboard_up = true;
    }
    if (key === 40) {
        //down arrow
        keyboard_down = true;
    }

    if (key === 37) {
        //left arrow
        keyboard_left = true;
    }
    if (key === 39) {
        //right arrow
        keyboard_right = true;
    }

    if (key === 32) {
        // space fire
        keyboard_fire = true;
    }
}



function keyUpHandler(event) {
    var key = event.which || event.keyCode;
    if (key === 38) {
        //up arrow
        keyboard_up = false;
    }
    if (key === 40) {
        //down arrow
        keyboard_down = false;
    }

    if (key === 37) {
        //left arrow
        keyboard_left = false;
    }
    if (key === 39) {
        //right arrow
        keyboard_right = false;
    }

    if (key === 32) {
        // space fire
        keyboard_fire = false;
    }
}
