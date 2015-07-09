function enemy () {
    this.bounce = true;
    this.point = 100;
    this.bonus = null;
    // hit check when be hit by player's bullets
    this.fireCounter = 0;
    this.fireInterval = 100;
	this.isBoss = false;
}
// new a unit as the enemies' prototype
enemy.prototype = new unit();

enemy.prototype.fire = function () {
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
			var new_bullet = new enemyBullet();
			// add new bullet as Object
			var new_id = enemyBullets.add(new_bullet);
			// add new bullet as DOM
			game.append("<div id='ebullet_" + new_id + "' class='bullet object'></div>");
			enemyBullets.items[new_id].x = x[i];
			enemyBullets.items[new_id].y = this.y + this.height;
			enemyBullets.items[new_id].init($("#ebullet_" + new_id), enemyBullets);
		}
    }
    this.fireCounter++;
}

enemy.prototype.hit_check = function () {
    var result = false;
    for (var i in playerBullets.items){
        if (this.collusion_check(playerBullets.items[i])){
            // delete objects
            this.hit();
            playerBullets.items[i].delete();
            // calc score
            setScore(score + this.point);
            // return result
            result = true;
        }
    }
    return result;
}

enemy.prototype.delete = function(hitToDie) {
    if (this.bonus != null && hitToDie){
        var new_supply = new supply(this.bonus);
        // add new supply as Object
        var new_id = supplyItems.add(new_supply);
        // add new bullet as DOM
        game.append("<div id='supply_" + new_id + "' class='supply object'></div>");
        supplyItems.items[new_id].x = this.x;
        supplyItems.items[new_id].y = this.y;
        supplyItems.items[new_id].init($("#supply_" + new_id), supplyItems);
    }
	
	if (this.isBoss){
		gameOver(true);
	}
	
    unit.prototype.delete.apply(this, []);
}