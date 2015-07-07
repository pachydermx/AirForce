function player () {
    // init
    this.speed = 10;
    // set HP
    this.maxHealth = 4;
    this.health = this.maxHealth;
    // set fire state
    this.fireInterval = 5;
    this.fireCounter = 0;
	this.fireColumns = 1;
    
    this.level = 0;
	this.maxLevel = 5;
    
}
// new a unit as the player's prototype
player.prototype = new unit();

// move function
player.prototype.move = function (rateX, rateY) {
    this.x += rateX * this.speed;
    this.y += rateY * this.speed;
    this.applyChange();
};

// apply change
player.prototype.applyChange = function () {
    this.x = Math.max(this.x, 0);
    this.y = Math.max(this.y, 0);
    this.x = Math.min(this.x, size[0] - this.width);
    this.y = Math.min(this.y, size[1] - this.height);
    this.dom.css("left", this.x);
    this.dom.css("top", this.y);
};
// fire function
player.prototype.fire = function () {
    if (this.fireCounter % this.fireInterval == 0){
		var x;
		switch (this.fireColumns){
			case 1:
				x = [this.x + this.width / 2];
				break;
			case 2:
				x = [this.x + this.width / 2 - 15, this.x + this.width / 2 + 15];
				break;
			case 3:
				x = [this.x + this.width / 2 - 30, this.x + this.width / 2, this.x + this.width /2 + 30];
			default:
				break;
		}
		for (var i in x) {
			var new_bullet = new bullet();
			// add new bullet as Object
			var new_id = playerBullets.add(new_bullet);
			// add new bullet as DOM
			game.append("<div id='bullet_" + new_id + "' class='bullet object'></div>");
			playerBullets.items[new_id].x = x[i];
			playerBullets.items[new_id].y = this.y;
			playerBullets.items[new_id].init($("#bullet_" + new_id), playerBullets);
		}
    }
    this.fireCounter++;
}

// hit check when be hit by enemies' bullets
player.prototype.hit_check = function () {
    // for enemy
    for (var i in enemys.items){
        if (this.collusion_check(enemys.items[i])){
            this.hit();
            enemys.items[i].delete();
            // display
            $("#health_bar").css("width", (this.health / this.maxHealth) * $("#health_display").width());
        }
    }
	// for enemy's bullet
	for (var i in enemyBullets.items){
        if (this.collusion_check(enemyBullets.items[i])){
            this.hit();
            enemyBullets.items[i].delete();
            // display
            $("#health_bar").css("width", (this.health / this.maxHealth) * $("#health_display").width());
        }
    }
    // for supply
    for (var i in supplyItems.items){
        if (this.collusion_check(supplyItems.items[i])){
			switch (supplyItems.items[i].type){
				case 'weapon':
					this.changeLevel(this.level + 1);
					break;
				case 'health':
					this.changeHealth(this.health + 1);
					break;
				default:
					break;
			}
			supplyItems.items[i].delete();
        }
    }
}

player.prototype.changeHealth = function (newHealth) {
	this.health = Math.min(newHealth, this.maxHealth);
	this.health = Math.max(this.health, 0);
    $("#health_bar").css("width", (this.health / this.maxHealth) * $("#health_display").width());
}

player.prototype.changeLevel = function (newLevel) {
	this.level = Math.min(newLevel, this.maxLevel);
	$("#weapon_level_display").text(this.level);
    switch (this.level){
		case 0:
			this.fireInterval = 5;
			this.fireColumns = 1;
		case 1:
			this.fireInterval = 4;
			this.fireColumns = 1;
			break;
		case 2:
			this.fireInterval = 3;
			this.fireColumns = 2;
			break;
		case 3:
			this.fireInterval = 3;
			this.fireColumns = 2;
			break;
		default:
			this.fireInterval = 2;
			this.fireColumns = 3;
			break;
	}
};

// vanish when HP = 0 or GameOver
player.prototype.delete = function () {
    gameOver(false);
    this.dom.remove();
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
}