function player () {
    // init
    this.speed = 15;
    this.class_name = "player";
    
    this.maxHealth = 4;
    this.health = this.maxHealth;
    
    this.fireInterval = 5;
    this.fireCounter = 0;
    
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
    
    this.fire = function () {
        if (this.fireCounter % this.fireInterval == 0){
            var new_bullet = new bullet();
            var new_id = playerBullets.add(new_bullet);
            game.append("<div id='bullet_" + new_id + "' class='bullet object'></div>");
            playerBullets.items[new_id].x = this.x + this.width / 2;
            playerBullets.items[new_id].y = this.y;
            playerBullets.items[new_id].init($("#bullet_" + new_id), playerBullets);
        }
        this.fireCounter++;
    }
    
    this.hit_check = function () {
        for (var i in enemys.items){
            if (this.collusion_check(enemys.items[i])){
                this.hit();
                enemys.items[i].delete();
                // display
                $("#health_bar").css("width", (this.health / this.maxHealth) * $("#health_display").width());
            }
        }
    }
    
    this.delete = function () {
        gameOver();
        this.dom.remove();
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
}

player.prototype = new unit();