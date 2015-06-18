function player (dom) {
    this.dom = dom;
    this.x = 0;
    this.y = 0;
    this.speed = 8;
    
    this.move = function (rateX, rateY) {
        this.x += rateX * this.speed;
        this.y += rateY * this.speed;
        this.apply();
    };
    
    this.apply = function () {
        this.dom.css("left", this.x);
        this.dom.css("top", this.y);
    };
}

player.prototype = unit;