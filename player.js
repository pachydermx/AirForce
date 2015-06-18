function player () {
    // init
    this.speed = 15;
    
    this.move = function (rateX, rateY) {
        this.x += rateX * this.speed;
        this.y += rateY * this.speed;
        this.apply();
    };
    
    this.apply = function () {
        this.x = Math.max(this.x, 0);
        this.y = Math.max(this.y, 0);
        this.x = Math.min(this.x, size[0]);
        this.y = Math.min(this.y, size[1]);
        this.dom.css("left", this.x);
        this.dom.css("top", this.y);
    };
    
    
}

player.prototype = new unit();