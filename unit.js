function unit() {
    var dom, width, height, health;
    this.x = 0;
    this.y = 0;
    this.speed = [0, 0];
    this.auto_delete = true;
    this.disabled = false;
    
    this.init = function (dom) {
        this.dom = dom;
        this.width = dom.width();
        this.height = dom.height();
    }
    
    this.step = function () {
        var tmpX = this.x + this.speed[0];
        var tmpY = this.y + this.speed[1];
        //console.log(tmpX < -this.width , tmpY < -this.height , tmpX > size[0] , tmpY > size[1]);
        if (tmpX < -this.width || tmpY < -this.height || tmpX > size[0] || tmpY > size[1]) {
            this.delete();
        } else {
            this.dom.css("left", tmpX);
            this.dom.css("top", tmpY);
            this.x = tmpX;
            this.y = tmpY;
        }
    };
    
    this.fire = function () {
        var new_bullet = new bullet();
        var new_id = objects.add(new_bullet);
        game.append("<div id='bullet_" + new_id + "' class='bullet object'></div>");
        objects.items[new_id].x = this.x + this.width / 2;
        objects.items[new_id].y = this.y;
        objects.items[new_id].init($("#bullet_" + new_id));
    }
    
    this.delete = function () {
        this.dom.remove();
        objects.remove(this.index);
    };
}