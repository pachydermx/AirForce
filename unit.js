function unit() {
    // dom : DOM of unit
    // class_name : class symbol of new unit instant
    var dom, width, height, health, list, class_name, point;
    this.x = 0;
    this.y = 0;
    //speed vector -> (x, y)
    this.speed = [0, 0];
    // flag : delete when touch the end border
    this.auto_delete = true;
    this.disabled = false;
    // flag : bounce when touch the left or right border
    this.bounce = false;
    // flag : timer for duration of hit state
    this.hitTimer = -1;
	
	this.isBoss = false;
}

// cosntruction
unit.prototype.init = function (dom, list) {
    // basic data
    this.dom = dom;
    this.width = dom.width();
    this.height = dom.height();
    this.list = list;
}
// move function for bullets and enemies
unit.prototype.step = function () {
    var tmpX = this.x + this.speed[0];
    var tmpY = this.y + this.speed[1];

    // border check
    // touch left or right 
    if (tmpX < -this.width || tmpX > size[0]) {
        if (this.bounce) {
            this.speed[0] *= -1;
        } else {
            this.delete();
        }
    }
    // touch the end
    if (tmpY < -this.height || tmpY > size[1]) {
        if (this.auto_delete) {
            this.delete(false);
        }
        if (this.bounce) {
            this.speed[1] *= -1;
        }
    } else {
        this.dom.css("left", tmpX);
        this.dom.css("top", tmpY);
        this.x = tmpX;
        this.y = tmpY;
    }
    // show red state when be hit in a short time(10 time unit)
    if (this.hitTimer == 0){
        this.dom.removeClass("hit");
        this.hitTimer = -1;
    } else if (this.hitTimer > 0){
        this.hitTimer--;
    }

};
// collusion check function
unit.prototype.collusion_check = function (target) {
    var deltaX = target.x - this.x;
    var deltaY = target.y - this.y;
    if ( deltaX > - target.width && deltaX < this.width && deltaY > - target.height && deltaY < this.height ) {
        return true;
    } else {
        return false;
    }
}
// state function when be hit
unit.prototype.hit = function () {
    this.dom.addClass("hit");
    this.hitTimer = 10;
    this.health--;
    if (this.health <= 0){
        this.delete(true);
    }
}
// vanish function
unit.prototype.delete = function (hitToDie) {
    this.dom.remove();
    this.list.remove(this.index);
};