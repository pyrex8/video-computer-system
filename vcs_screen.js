var ctx = ctx || {};
var canvas = canvas || {};

var SCREEN_X = 160;
var SCREEN_Y = 208;

var INTERLACE = 2;

var PF_PIXEL = 4;

var NUMBER_OF_OBJECTS = 6;
//# bit xs for collison detection
//# bl, pf, m1, p1, m0, p0
var BL = 0;
var P0 = 1;
var M0 = 2;
var P1 = 3;
var M1 = 4;
var PF = 5;

var collision_detection = [NUMBER_OF_OBJECTS];
var collision_array = [SCREEN_X * SCREEN_Y];


function screen() {
    //"""rescale window"""
    var p_width = Math.trunc(window.innerWidth / SCREEN_X / INTERLACE),
        p_height = Math.trunc(window.innerHeight / SCREEN_Y);
    if (p_width < p_height) {
        ctx.canvas.width = p_width * SCREEN_X * INTERLACE;
        ctx.canvas.height = p_width * SCREEN_Y;
    } else {
        ctx.canvas.width = p_height * SCREEN_X * INTERLACE;
        ctx.canvas.height = p_height * SCREEN_Y;
    }
}


function rectangle(x, y, width, height, color) {
    //"""draw rectangle with scaling"""
    var pixel_width = canvas.width / SCREEN_X,
        pixel_height = canvas.height / SCREEN_Y;
    ctx.beginPath();
    ctx.rect(x * pixel_width, y * pixel_height, width * pixel_width, height * pixel_height);
    ctx.fillStyle = colorsHex[color];
    ctx.fill();
    ctx.closePath();
}


function reset_collision() {
    //"""Clear collisoin detection."""
    var i, j;
    for (i = 0; i < NUMBER_OF_OBJECTS; i += 1) {
        collision_detection[i] = 0;
    }
    for (j = 0; j < (SCREEN_X * SCREEN_Y); j += 1) {
        collision_array[j] = 0;
    }
}


function update_collision(new_object, x, y) {
    //"""Update array and collision registers."""
    if ((x >= 0) && (x < SCREEN_X) && (y >= 0) && (y < SCREEN_Y)) {
        collision_array[x + (y * SCREEN_X)] |= (1 << new_object);
        collision_detection[new_object] |= collision_array[x + (y * SCREEN_X)];
    }
}


function test_for_object(test_object, x, y) {
    //"""Test to see what objects are in location."""
    var test_value = 0;
    if ((x >= 0) && (x < SCREEN_X) && (y >= 0) && (y < SCREEN_Y)) {
        if (collision_array[x + (y * SCREEN_X)] & (1 << test_object)) {
            test_value = 1;
        }
    }
    return test_value;
}


function get_collision(first_object, second_object) {
    //"""Performs a test between two objects (P0, M0, P1, M0, ,PF, BL)
    // 0 = no collision, 1 = collision."""     
    var test_value = 0;

    if ((collision_detection[first_object] & (1 << second_object)) > 0) {
        test_value = 1;
    }

    if ((collision_detection[second_object] & (1 << first_object)) > 0) {
        test_value = 1;
    }

    return test_value;
}


// define Background constructor

function Background(y, height, color) {
  this.y = y;
  this.height = height;
  this.color = color;
}

// define Background draw method

Background.prototype.draw = function() {
  rectangle(0, this.y, SCREEN_X, this.height, this.color);
}


