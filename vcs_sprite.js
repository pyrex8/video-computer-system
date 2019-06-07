
// define Background constructor

function Sprite(number, x, y, data, color, index, pixel_width, pixel_height, direction)  {
  this.number = number;
  this.x = x;
  this.y = y;
  this.data = data;
  this.color = color;
  this.index = index;
  this.pixel_width = pixel_width;
  this.pixel_height = pixel_height;
  this.direction = direction;
}

// define Background draw method

Sprite.prototype.draw = function() {
    //"""Player0 drawing and collision detection."""  
    var i,
        j,
        m,
        n,
        line_length = this.data[0].length,
        sprite_height = this.color.length;
    for (j = 0; j < sprite_height; j += 1) {
        for (i = 0; i < line_length; i += 1) {
            if (this.data[j + (sprite_height * this.index)].charAt(((line_length - 1) * this.direction) + (1 - 2 * this.direction) * i) === 'X') {
                rectangle(this.x + i * this.pixel_width, this.y + j * this.pixel_height, this.pixel_width, this.pixel_height, this.color[j]);
                for (n = 0; n < this.pixel_width; n += 1) {
                    for (m = 0; m < this.pixel_height; m += 1) {
                        update_collision(this.number, this.x + (i * this.pixel_width) + n, this.y + (j * this.pixel_height) + m);
                    }
                }
            }
        }
    }
}
