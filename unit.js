function unit() {
    var dom, width, height, health, list, class_name, point;
    this.x = 0;
    this.y = 0;
    this.speed = [0, 0];
    this.auto_delete = true;
    this.disabled = false;
    this.bounce = false;
    
    this.hitTimer = -1;
    
    this.init = function (dom, list) {
        // basic data
        this.dom = dom;
        this.width = dom.width();
        this.height = dom.height();
        this.list = list;
    }
    
    this.step = function () {
        var tmpX = this.x + this.speed[0];
        var tmpY = this.y + this.speed[1];
        
        // border check
        if (tmpX < -this.width || tmpX > size[0]) {
            if (this.bounce) {
                this.speed[0] *= -1;
            } else {
                this.delete();
            }
        }
        if (tmpY < -this.height || tmpY > size[1]) {
            if (this.auto_delete) {
                this.delete();
            }
        } else {
            this.dom.css("left", tmpX);
            this.dom.css("top", tmpY);
            this.x = tmpX;
            this.y = tmpY;
        }
        
        if (this.hitTimer == 0){
            this.dom.removeClass("hit");
            this.hitTimer = -1;
        } else if (this.hitTimer > 0){
            this.hitTimer--;
        }
        
    };
    
    this.collusion_check = function (target) {
        var deltaX = target.x - this.x;
        var deltaY = target.y - this.y;
        if ( deltaX > - target.width && deltaX < this.width && deltaY > - target.height && deltaY < this.height ) {
            return true;
        } else {
            return false;
        }
    }
    
    this.hit = function () {
        this.dom.addClass("hit");
        this.hitTimer = 10;
        this.health--;
        if (this.health <= 0){
            this.delete();
        }
    }
    
    this.delete = function () {
        this.dom.remove();
        this.list.remove(this.index);
    };
}